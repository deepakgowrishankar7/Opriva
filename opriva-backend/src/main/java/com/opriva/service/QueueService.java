package com.opriva.service;

import com.opriva.dto.QueueDtos.*;
import com.opriva.dto.RegistrationDtos.*;
import com.opriva.entity.*;
import com.opriva.enums.*;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.repository.*;
import com.opriva.websocket.QueueWebSocketPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QueueService {

    private final QueueTokenRepository queueTokenRepository;
    private final QueueStateHistoryRepository queueStateHistoryRepository;
    private final OpRegistrationRepository opRegistrationRepository;
    private final HospitalRepository hospitalRepository;
    private final OpRegistrationTypeRepository opRegistrationTypeRepository;
    private final UserRepository userRepository;
    private final DigitalReceiptRepository digitalReceiptRepository;
    private final QueueWebSocketPublisher webSocketPublisher;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public QueueService(
            QueueTokenRepository queueTokenRepository,
            QueueStateHistoryRepository queueStateHistoryRepository,
            OpRegistrationRepository opRegistrationRepository,
            HospitalRepository hospitalRepository,
            OpRegistrationTypeRepository opRegistrationTypeRepository,
            UserRepository userRepository,
            DigitalReceiptRepository digitalReceiptRepository,
            QueueWebSocketPublisher webSocketPublisher,
            AuditService auditService,
            NotificationService notificationService) {
        this.queueTokenRepository = queueTokenRepository;
        this.queueStateHistoryRepository = queueStateHistoryRepository;
        this.opRegistrationRepository = opRegistrationRepository;
        this.hospitalRepository = hospitalRepository;
        this.opRegistrationTypeRepository = opRegistrationTypeRepository;
        this.userRepository = userRepository;
        this.digitalReceiptRepository = digitalReceiptRepository;
        this.webSocketPublisher = webSocketPublisher;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public LiveQueueStatusDto getPatientLiveQueueStatus(String opRegistrationId) {
        OpRegistration reg = opRegistrationRepository.findById(opRegistrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found: " + opRegistrationId));

        QueueToken token = queueTokenRepository.findByOpRegistrationId(opRegistrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue token not found for registration: " + opRegistrationId));

        LiveQueueStatusDto dto = new LiveQueueStatusDto();
        dto.setHospitalId(reg.getHospital().getId());
        dto.setHospitalName(reg.getHospital().getName());
        dto.setOpRegistrationNumber(reg.getOpRegistrationNumber());
        dto.setTokenNumber(token.getTokenNumber());
        dto.setRegistrationType(reg.getOpRegistrationType().getDisplayName());
        dto.setQueueState(token.getQueueState());
        dto.setReceptionistPhone(reg.getHospital().getReceptionistPhone() != null ? reg.getHospital().getReceptionistPhone() : "Not provided");
        dto.setLastUpdated(token.getUpdatedAt());

        // Currently called token
        List<QueueToken> activeTokens = queueTokenRepository.findCurrentlyActiveTokens(reg.getHospital().getId(), reg.getSessionDate());
        if (!activeTokens.isEmpty()) {
            dto.setCurrentTokenBeingCalled(activeTokens.get(0).getTokenNumber());
        } else {
            dto.setCurrentTokenBeingCalled("None currently");
        }

        // Calculate patients ahead if waiting
        if (token.getQueueState() == QueueState.WAITING) {
            long ahead = queueTokenRepository.countWaitingAhead(
                    reg.getHospital().getId(),
                    reg.getSessionDate(),
                    token.getPriorityWeight(),
                    token.getTokenSequence());
            dto.setPatientsAhead(ahead);
            dto.setEstimatedWaitingMinutes((int) (ahead * 8)); // ~8 mins avg outpatient consultation
        } else if (token.getQueueState() == QueueState.CALLED) {
            dto.setPatientsAhead(0);
            dto.setEstimatedWaitingMinutes(0);
        } else {
            dto.setPatientsAhead(0);
            dto.setEstimatedWaitingMinutes(0);
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public ReceptionistQueueOverviewDto getReceptionistOverview(String hospitalId, LocalDate sessionDate) {
        if (sessionDate == null) sessionDate = LocalDate.now();

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found: " + hospitalId));

        List<QueueToken> tokens = queueTokenRepository.findByHospitalIdAndSessionDateOrderByPriorityWeightDescTokenSequenceAsc(hospitalId, sessionDate);

        ReceptionistQueueOverviewDto overview = new ReceptionistQueueOverviewDto();
        overview.setHospitalId(hospitalId);
        overview.setHospitalName(hospital.getName());
        overview.setSessionDate(sessionDate);
        overview.setTotalRegistrations(tokens.size());

        long waiting = 0, called = 0, inConsultation = 0, completed = 0, noShow = 0;
        String curNormal = "-", curSpecial = "-";

        for (QueueToken t : tokens) {
            switch (t.getQueueState()) {
                case WAITING -> waiting++;
                case CALLED -> {
                    called++;
                    if (t.getOpRegistrationType().getTypeCode() == RegistrationTypeCode.SPECIAL) {
                        curSpecial = t.getTokenNumber();
                    } else {
                        curNormal = t.getTokenNumber();
                    }
                }
                case IN_CONSULTATION -> inConsultation++;
                case COMPLETED -> completed++;
                case NO_SHOW -> noShow++;
                default -> {}
            }
        }

        overview.setWaitingCount(waiting);
        overview.setCalledCount(called);
        overview.setInConsultationCount(inConsultation);
        overview.setCompletedCount(completed);
        overview.setNoShowCount(noShow);
        overview.setCurrentNormalToken(curNormal);
        overview.setCurrentSpecialToken(curSpecial);

        List<QueueTokenDto> queueList = tokens.stream().map(this::mapToTokenDto).collect(Collectors.toList());
        overview.setQueueList(queueList);

        return overview;
    }

    @Transactional
    public QueueTokenDto callNextToken(String hospitalId, User receptionistUser) {
        LocalDate today = LocalDate.now();
        List<QueueToken> waitingTokens = queueTokenRepository.findByHospitalIdAndSessionDateOrderByPriorityWeightDescTokenSequenceAsc(hospitalId, today);

        QueueToken nextToCall = waitingTokens.stream()
                .filter(t -> t.getQueueState() == QueueState.WAITING)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No patients waiting in queue"));

        QueueState previous = nextToCall.getQueueState();
        nextToCall.setQueueState(QueueState.CALLED);
        nextToCall.setCalledAt(LocalDateTime.now());
        nextToCall.setUpdatedAt(LocalDateTime.now());
        QueueToken saved = queueTokenRepository.save(nextToCall);

        recordStateHistory(saved, previous, QueueState.CALLED, receptionistUser, "Called next in turn");

        // Real-time broadcast
        webSocketPublisher.broadcastHospitalQueue(hospitalId, "TOKEN_CALLED:" + saved.getTokenNumber());
        notificationService.createNotification(
                saved.getOpRegistration().getPatient().getId(),
                "Your Token Has Been Called!",
                String.format("Token %s is now called at the OP Desk. Please proceed to the consultation room.", saved.getTokenNumber()),
                "TOKEN_CALLED");

        auditService.logAction(receptionistUser.getId(), "QUEUE_CALL_NEXT", "QueueToken", saved.getId(),
                "Token " + saved.getTokenNumber() + " called by receptionist", null);

        return mapToTokenDto(saved);
    }

    @Transactional
    public QueueTokenDto updateTokenState(String tokenId, UpdateQueueStateRequest request, User receptionistUser) {
        QueueToken token = queueTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue token not found: " + tokenId));

        QueueState from = token.getQueueState();
        QueueState to = request.getTargetState();

        token.setQueueState(to);
        token.setUpdatedAt(LocalDateTime.now());

        if (to == QueueState.CALLED && token.getCalledAt() == null) {
            token.setCalledAt(LocalDateTime.now());
        } else if (to == QueueState.IN_CONSULTATION) {
            token.setStartedAt(LocalDateTime.now());
        } else if (to == QueueState.COMPLETED) {
            token.setCompletedAt(LocalDateTime.now());
        }

        QueueToken saved = queueTokenRepository.save(token);
        recordStateHistory(saved, from, to, receptionistUser, request.getReason());

        webSocketPublisher.broadcastHospitalQueue(token.getHospital().getId(), "STATE_CHANGED:" + token.getTokenNumber() + "->" + to);

        auditService.logAction(receptionistUser.getId(), "QUEUE_STATE_UPDATE", "QueueToken", saved.getId(),
                String.format("State changed from %s to %s. Reason: %s", from, to, request.getReason()), null);

        return mapToTokenDto(saved);
    }

    @Transactional
    public RegistrationConfirmationDto registerWalkIn(WalkInRegistrationRequest request, User receptionistUser) {
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found: " + request.getHospitalId()));

        OpRegistrationType registrationType = opRegistrationTypeRepository.findById(request.getOpRegistrationTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Registration type not found: " + request.getOpRegistrationTypeId()));

        // Lookup or create walk-in patient record
        User patient = userRepository.findByPhone(request.getPatientPhone()).orElseGet(() -> {
            User newUser = new User();
            newUser.setId(UUID.randomUUID().toString());
            newUser.setFullName(request.getPatientName());
            newUser.setPhone(request.getPatientPhone());
            newUser.setEmail(request.getPatientPhone() + "@walkin.opriva.local");
            newUser.setPasswordHash("$2a$10$wE9mN5b8C7kLz7aW1o4pkuH2pZ/2R/4o/wFmI3mKzH4I/6zYJ4QyW"); // secure default
            newUser.setRole(Role.ROLE_PATIENT);
            newUser.setActive(true);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });

        LocalDate sessionDate = LocalDate.now();
        String datePart = sessionDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long countToday = opRegistrationRepository.countByHospitalAndDate(hospital.getId(), sessionDate);
        String opRegistrationNumber = String.format("OPR-%s-%04d", datePart, countToday + 1);

        // Record Confirmed OP Registration
        OpRegistration registration = new OpRegistration();
        registration.setId(UUID.randomUUID().toString());
        registration.setHospital(hospital);
        registration.setOpRegistrationType(registrationType);
        registration.setPatient(patient);
        registration.setOpRegistrationNumber(opRegistrationNumber);
        registration.setSessionDate(sessionDate);
        registration.setFeePaid(registrationType.getFeeAmount());
        registration.setCurrency(registrationType.getCurrency());
        registration.setStatus(RegistrationStatus.CONFIRMED);
        registration.setCreatedAt(LocalDateTime.now());
        registration.setUpdatedAt(LocalDateTime.now());
        OpRegistration savedReg = opRegistrationRepository.save(registration);

        // Issue Queue Token
        RegistrationTypeCode typeCode = registrationType.getTypeCode();
        Integer maxSeq = queueTokenRepository.findMaxSequence(hospital.getId(), sessionDate, typeCode);
        int nextSeq = (maxSeq == null) ? 1 : maxSeq + 1;
        String prefix = (typeCode == RegistrationTypeCode.SPECIAL) ? "S-" : "N-";
        int baseNumber = (typeCode == RegistrationTypeCode.SPECIAL) ? 200 : 100;
        String tokenNumber = prefix + (baseNumber + nextSeq);

        QueueToken token = new QueueToken();
        token.setId(UUID.randomUUID().toString());
        token.setHospital(hospital);
        token.setOpRegistration(savedReg);
        token.setOpRegistrationType(registrationType);
        token.setTokenNumber(tokenNumber);
        token.setTokenSequence(nextSeq);
        token.setSessionDate(sessionDate);
        token.setQueueState(QueueState.WAITING);
        token.setPriorityWeight(registrationType.getPriorityLevel());
        token.setCreatedAt(LocalDateTime.now());
        token.setUpdatedAt(LocalDateTime.now());
        QueueToken savedToken = queueTokenRepository.save(token);

        recordStateHistory(savedToken, null, QueueState.WAITING, receptionistUser, "Walk-in registration at counter: " + request.getPaymentMethod());

        // Digital Receipt for walk-in counter payment
        String receiptNumber = "RCP-COUNTER-" + datePart + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        DigitalReceipt receipt = new DigitalReceipt();
        receipt.setId(UUID.randomUUID().toString());
        receipt.setOpRegistration(savedReg);
        receipt.setReceiptNumber(receiptNumber);
        receipt.setHospitalName(hospital.getName());
        receipt.setPatientName(patient.getFullName());
        receipt.setRegistrationTypeName(registrationType.getDisplayName());
        receipt.setFeePaid(registrationType.getFeeAmount());
        receipt.setCurrency(registrationType.getCurrency());
        receipt.setPaymentReference("COUNTER:" + request.getPaymentMethod());
        receipt.setTokenNumber(tokenNumber);
        receipt.setIssuedAt(LocalDateTime.now());
        digitalReceiptRepository.save(receipt);

        auditService.logAction(receptionistUser.getId(), "WALK_IN_REGISTRATION", "OpRegistration", savedReg.getId(),
                "Walk-in patient registered. Token: " + tokenNumber + ", Payment: " + request.getPaymentMethod(), null);

        webSocketPublisher.broadcastHospitalQueue(hospital.getId(), "WALK_IN_REGISTERED:" + tokenNumber);

        RegistrationConfirmationDto confirmation = new RegistrationConfirmationDto();
        confirmation.setRegistrationId(savedReg.getId());
        confirmation.setOpRegistrationNumber(opRegistrationNumber);
        confirmation.setTokenNumber(tokenNumber);
        confirmation.setHospitalName(hospital.getName());
        confirmation.setPatientName(patient.getFullName());
        confirmation.setRegistrationType(registrationType.getDisplayName());
        confirmation.setSessionDate(sessionDate);
        confirmation.setFeePaid(registrationType.getFeeAmount());
        confirmation.setCurrency(registrationType.getCurrency());
        confirmation.setQueueState(QueueState.WAITING);
        confirmation.setDigitalReceiptNumber(receiptNumber);
        confirmation.setConfirmedAt(savedReg.getCreatedAt());

        return confirmation;
    }

    private void recordStateHistory(QueueToken token, QueueState from, QueueState to, User user, String reason) {
        QueueStateHistory history = new QueueStateHistory();
        history.setId(UUID.randomUUID().toString());
        history.setQueueToken(token);
        history.setFromState(from);
        history.setToState(to);
        history.setChangedByUser(user);
        history.setReason(reason);
        history.setChangedAt(LocalDateTime.now());
        queueStateHistoryRepository.save(history);
    }

    private QueueTokenDto mapToTokenDto(QueueToken t) {
        QueueTokenDto dto = new QueueTokenDto();
        dto.setTokenId(t.getId());
        dto.setTokenNumber(t.getTokenNumber());
        dto.setTokenSequence(t.getTokenSequence());
        dto.setOpRegistrationNumber(t.getOpRegistration().getOpRegistrationNumber());
        dto.setPatientName(t.getOpRegistration().getDependent() != null 
                ? t.getOpRegistration().getDependent().getFullName() 
                : t.getOpRegistration().getPatient().getFullName());
        dto.setPatientPhone(t.getOpRegistration().getPatient().getPhone());
        dto.setRegistrationTypeName(t.getOpRegistrationType().getDisplayName());
        dto.setPriorityWeight(t.getPriorityWeight());
        dto.setQueueState(t.getQueueState());
        dto.setCalledAt(t.getCalledAt());
        dto.setStartedAt(t.getStartedAt());
        dto.setCompletedAt(t.getCompletedAt());
        return dto;
    }
}
