package com.opriva.service;

import com.opriva.dto.RegistrationDtos.*;
import com.opriva.entity.*;
import com.opriva.enums.*;
import com.opriva.exception.PaymentVerificationException;
import com.opriva.exception.ReservationExpiredException;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.repository.*;
import com.opriva.service.adapter.PaymentGatewayAdapter;
import com.opriva.websocket.QueueWebSocketPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final SlotReservationRepository slotReservationRepository;
    private final PaymentOrderRepository paymentOrderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final OpRegistrationRepository opRegistrationRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final QueueStateHistoryRepository queueStateHistoryRepository;
    private final DigitalReceiptRepository digitalReceiptRepository;
    private final PaymentGatewayAdapter paymentGatewayAdapter;
    private final NotificationService notificationService;
    private final QueueWebSocketPublisher webSocketPublisher;
    private final AuditService auditService;

    public PaymentService(
            SlotReservationRepository slotReservationRepository,
            PaymentOrderRepository paymentOrderRepository,
            PaymentTransactionRepository paymentTransactionRepository,
            OpRegistrationRepository opRegistrationRepository,
            QueueTokenRepository queueTokenRepository,
            QueueStateHistoryRepository queueStateHistoryRepository,
            DigitalReceiptRepository digitalReceiptRepository,
            PaymentGatewayAdapter paymentGatewayAdapter,
            NotificationService notificationService,
            QueueWebSocketPublisher webSocketPublisher,
            AuditService auditService) {
        this.slotReservationRepository = slotReservationRepository;
        this.paymentOrderRepository = paymentOrderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.opRegistrationRepository = opRegistrationRepository;
        this.queueTokenRepository = queueTokenRepository;
        this.queueStateHistoryRepository = queueStateHistoryRepository;
        this.digitalReceiptRepository = digitalReceiptRepository;
        this.paymentGatewayAdapter = paymentGatewayAdapter;
        this.notificationService = notificationService;
        this.webSocketPublisher = webSocketPublisher;
        this.auditService = auditService;
    }

    @Transactional
    public PaymentOrder createPaymentOrder(String reservationId, String userId) {
        SlotReservation reservation = slotReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationId));

        if (!reservation.getPatient().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to reservation");
        }

        if (reservation.getStatus() != ReservationStatus.RESERVED || reservation.isExpired()) {
            reservation.setStatus(ReservationStatus.EXPIRED);
            slotReservationRepository.save(reservation);
            throw new ReservationExpiredException("Reservation has expired. Please select a new slot.");
        }

        // Check if payment order already exists
        Optional<PaymentOrder> existingOrder = paymentOrderRepository.findBySlotReservationId(reservationId);
        if (existingOrder.isPresent()) {
            return existingOrder.get();
        }

        String providerOrderId = paymentGatewayAdapter.createOrder(
                reservation.getOpRegistrationType().getFeeAmount(),
                reservation.getOpRegistrationType().getCurrency(),
                "OPR-RES-" + reservation.getId().substring(0, 8));

        PaymentOrder order = new PaymentOrder();
        order.setId(UUID.randomUUID().toString());
        order.setSlotReservation(reservation);
        order.setPatient(reservation.getPatient());
        order.setProviderOrderId(providerOrderId);
        order.setAmount(reservation.getOpRegistrationType().getFeeAmount());
        order.setCurrency(reservation.getOpRegistrationType().getCurrency());
        order.setStatus(PaymentStatus.INITIATED);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return paymentOrderRepository.save(order);
    }

    @Transactional
    public RegistrationConfirmationDto verifyPaymentAndConfirmRegistration(VerifyPaymentRequest request, String userId) {
        SlotReservation reservation = slotReservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + request.getReservationId()));

        if (!reservation.getPatient().getId().equals(userId)) {
            throw new SecurityException("Unauthorized user attempting payment verification");
        }

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            // Idempotent return if already confirmed
            log.info("Reservation {} already confirmed. Returning existing registration.", reservation.getId());
            return getExistingConfirmation(reservation);
        }

        if (reservation.isExpired() && reservation.getStatus() == ReservationStatus.RESERVED) {
            reservation.setStatus(ReservationStatus.EXPIRED);
            slotReservationRepository.save(reservation);
            throw new ReservationExpiredException("Slot reservation has expired before payment verification.");
        }

        // Verify with Payment Gateway server-side signature
        boolean verified = paymentGatewayAdapter.verifySignature(
                request.getProviderOrderId(),
                request.getProviderPaymentId(),
                request.getProviderSignature());

        if (!verified) {
            auditService.logAction(userId, "PAYMENT_VERIFICATION_FAILED", "Reservation", reservation.getId(),
                    "Signature verification failed for order " + request.getProviderOrderId(), null);
            throw new PaymentVerificationException("Payment signature verification failed. Booking not confirmed.");
        }

        // Prevent duplicate transaction processing
        if (paymentTransactionRepository.existsByProviderPaymentId(request.getProviderPaymentId())) {
            log.warn("Payment ID {} already processed. Idempotency safeguard triggered.", request.getProviderPaymentId());
            return getExistingConfirmation(reservation);
        }

        // 1. Update Payment Order
        PaymentOrder order = paymentOrderRepository.findByProviderOrderId(request.getProviderOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment order not found: " + request.getProviderOrderId()));
        order.setStatus(PaymentStatus.SUCCESSFUL);
        order.setUpdatedAt(LocalDateTime.now());
        paymentOrderRepository.save(order);

        // 2. Record Payment Transaction
        PaymentTransaction tx = new PaymentTransaction();
        tx.setId(UUID.randomUUID().toString());
        tx.setPaymentOrder(order);
        tx.setProviderPaymentId(request.getProviderPaymentId());
        tx.setProviderSignature(request.getProviderSignature());
        tx.setPaymentMethod("ONLINE_GATEWAY");
        tx.setStatus("SUCCESS");
        tx.setRawResponse("Verified via " + paymentGatewayAdapter.getProviderName());
        tx.setCreatedAt(LocalDateTime.now());
        paymentTransactionRepository.save(tx);

        // 3. Confirm Slot Reservation
        reservation.setStatus(ReservationStatus.CONFIRMED);
        slotReservationRepository.save(reservation);

        // 4. Generate Unique OP Registration Number
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long countToday = opRegistrationRepository.countByHospitalAndDate(reservation.getHospital().getId(), reservation.getSessionDate());
        String opRegistrationNumber = String.format("OPR-%s-%04d", datePart, countToday + 1);

        OpRegistration registration = new OpRegistration();
        registration.setId(UUID.randomUUID().toString());
        registration.setHospital(reservation.getHospital());
        registration.setOpRegistrationType(reservation.getOpRegistrationType());
        registration.setPatient(reservation.getPatient());
        registration.setDependent(reservation.getDependent());
        registration.setSlotReservation(reservation);
        registration.setOpRegistrationNumber(opRegistrationNumber);
        registration.setSessionDate(reservation.getSessionDate());
        registration.setFeePaid(order.getAmount());
        registration.setCurrency(order.getCurrency());
        registration.setStatus(RegistrationStatus.CONFIRMED);
        registration.setCreatedAt(LocalDateTime.now());
        registration.setUpdatedAt(LocalDateTime.now());

        OpRegistration savedRegistration = opRegistrationRepository.save(registration);

        // 5. Generate Queue Token (e.g. N-101 for Normal, S-201 for Special)
        RegistrationTypeCode typeCode = reservation.getOpRegistrationType().getTypeCode();
        Integer maxSeq = queueTokenRepository.findMaxSequence(
                reservation.getHospital().getId(), reservation.getSessionDate(), typeCode);
        int nextSeq = (maxSeq == null) ? 1 : maxSeq + 1;

        String prefix = (typeCode == RegistrationTypeCode.SPECIAL) ? "S-" : "N-";
        int baseNumber = (typeCode == RegistrationTypeCode.SPECIAL) ? 200 : 100;
        String tokenNumber = prefix + (baseNumber + nextSeq);

        QueueToken token = new QueueToken();
        token.setId(UUID.randomUUID().toString());
        token.setHospital(reservation.getHospital());
        token.setOpRegistration(savedRegistration);
        token.setOpRegistrationType(reservation.getOpRegistrationType());
        token.setTokenNumber(tokenNumber);
        token.setTokenSequence(nextSeq);
        token.setSessionDate(reservation.getSessionDate());
        token.setQueueState(QueueState.WAITING);
        token.setPriorityWeight(reservation.getOpRegistrationType().getPriorityLevel());
        token.setCreatedAt(LocalDateTime.now());
        token.setUpdatedAt(LocalDateTime.now());

        QueueToken savedToken = queueTokenRepository.save(token);

        // Record initial state history
        QueueStateHistory history = new QueueStateHistory();
        history.setId(UUID.randomUUID().toString());
        history.setQueueToken(savedToken);
        history.setFromState(null);
        history.setToState(QueueState.WAITING);
        history.setChangedByUser(reservation.getPatient());
        history.setReason("Online booking and payment confirmed");
        history.setChangedAt(LocalDateTime.now());
        queueStateHistoryRepository.save(history);

        // 6. Generate Digital Receipt
        String receiptNumber = "RCP-" + datePart + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        DigitalReceipt receipt = new DigitalReceipt();
        receipt.setId(UUID.randomUUID().toString());
        receipt.setOpRegistration(savedRegistration);
        receipt.setReceiptNumber(receiptNumber);
        receipt.setHospitalName(reservation.getHospital().getName());
        receipt.setPatientName(reservation.getDependent() != null ? reservation.getDependent().getFullName() : reservation.getPatient().getFullName());
        receipt.setRegistrationTypeName(reservation.getOpRegistrationType().getDisplayName());
        receipt.setFeePaid(order.getAmount());
        receipt.setCurrency(order.getCurrency());
        receipt.setPaymentReference(request.getProviderPaymentId());
        receipt.setTokenNumber(tokenNumber);
        receipt.setIssuedAt(LocalDateTime.now());
        digitalReceiptRepository.save(receipt);

        // 7. Audit log & Notification
        auditService.logAction(userId, "OP_REGISTRATION_CONFIRMED", "OpRegistration", savedRegistration.getId(),
                "Confirmed OP registration with token " + tokenNumber + ", Fee: " + order.getAmount(), null);

        notificationService.createNotification(
                userId,
                "OP Registration Confirmed",
                String.format("Your registration at %s is confirmed. Token: %s. OP Reg No: %s",
                        reservation.getHospital().getName(), tokenNumber, opRegistrationNumber),
                "REGISTRATION_CONFIRMED");

        // Broadcast real-time queue update for hospital receptionists and patients
        webSocketPublisher.broadcastHospitalQueue(reservation.getHospital().getId(), "QUEUE_UPDATED");

        return buildConfirmationDto(savedRegistration, savedToken, receiptNumber);
    }

    private RegistrationConfirmationDto getExistingConfirmation(SlotReservation reservation) {
        OpRegistration reg = opRegistrationRepository.findAll().stream()
                .filter(r -> r.getSlotReservation() != null && r.getSlotReservation().getId().equals(reservation.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found for reservation"));

        QueueToken token = queueTokenRepository.findByOpRegistrationId(reg.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Queue token not found for registration"));

        String receiptNo = digitalReceiptRepository.findByOpRegistrationId(reg.getId())
                .map(DigitalReceipt::getReceiptNumber).orElse("RCP-RECORDED");

        return buildConfirmationDto(reg, token, receiptNo);
    }

    private RegistrationConfirmationDto buildConfirmationDto(OpRegistration reg, QueueToken token, String receiptNumber) {
        RegistrationConfirmationDto dto = new RegistrationConfirmationDto();
        dto.setRegistrationId(reg.getId());
        dto.setOpRegistrationNumber(reg.getOpRegistrationNumber());
        dto.setTokenNumber(token.getTokenNumber());
        dto.setHospitalName(reg.getHospital().getName());
        dto.setPatientName(reg.getDependent() != null ? reg.getDependent().getFullName() : reg.getPatient().getFullName());
        dto.setRegistrationType(reg.getOpRegistrationType().getDisplayName());
        dto.setSessionDate(reg.getSessionDate());
        dto.setFeePaid(reg.getFeePaid());
        dto.setCurrency(reg.getCurrency());
        dto.setQueueState(token.getQueueState());
        dto.setDigitalReceiptNumber(receiptNumber);
        dto.setConfirmedAt(reg.getCreatedAt());
        return dto;
    }
}
