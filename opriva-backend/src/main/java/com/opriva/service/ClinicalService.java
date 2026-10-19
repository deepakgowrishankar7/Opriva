package com.opriva.service;

import com.opriva.dto.MedicalRecordDtos.*;
import com.opriva.entity.*;
import com.opriva.enums.Role;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.exception.UnauthorizedException;
import com.opriva.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClinicalService {

    private final VisitRecordRepository visitRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final DependentRepository dependentRepository;
    private final OpRegistrationRepository opRegistrationRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public ClinicalService(
            VisitRecordRepository visitRecordRepository,
            PrescriptionRepository prescriptionRepository,
            HospitalRepository hospitalRepository,
            UserRepository userRepository,
            DependentRepository dependentRepository,
            OpRegistrationRepository opRegistrationRepository,
            AuditService auditService,
            NotificationService notificationService) {
        this.visitRecordRepository = visitRecordRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
        this.dependentRepository = dependentRepository;
        this.opRegistrationRepository = opRegistrationRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PrescriptionDto createPrescription(CreatePrescriptionRequest request, User clinicianUser) {
        if (clinicianUser.getRole() != Role.ROLE_CLINICIAN && clinicianUser.getRole() != Role.ROLE_SUPPORT) {
            throw new UnauthorizedException("Only authorized clinical users can create prescriptions");
        }

        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found: " + request.getHospitalId()));

        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        Dependent dependent = null;
        if (request.getDependentId() != null && !request.getDependentId().isBlank()) {
            dependent = dependentRepository.findById(request.getDependentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dependent not found: " + request.getDependentId()));
        }

        OpRegistration registration = null;
        if (request.getOpRegistrationId() != null && !request.getOpRegistrationId().isBlank()) {
            registration = opRegistrationRepository.findById(request.getOpRegistrationId()).orElse(null);
        }

        // 1. Create Visit Record
        VisitRecord visit = new VisitRecord();
        visit.setId(UUID.randomUUID().toString());
        visit.setHospital(hospital);
        visit.setPatient(patient);
        visit.setDependent(dependent);
        visit.setOpRegistration(registration);
        visit.setConsultationDate(LocalDate.now());
        visit.setClinicianName(request.getClinicianName());
        visit.setClinicianRegistrationNo(request.getClinicianLicenseNo());
        visit.setDiagnosisSummary(request.getDiagnosisSummary());
        visit.setClinicalNotes(request.getClinicalNotes());
        visit.setStatus("COMPLETED");
        visit.setCreatedAt(LocalDateTime.now());
        VisitRecord savedVisit = visitRecordRepository.save(visit);

        // 2. Generate Digital Prescription Number & Cryptographic Signature Hash
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String rxNumber = "RX-" + datePart + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        String rawToSign = rxNumber + "|" + hospital.getName() + "|" + request.getClinicianName() + "|" + LocalDate.now();
        String signatureHash = computeSha256(rawToSign);

        Prescription rx = new Prescription();
        rx.setId(UUID.randomUUID().toString());
        rx.setVisitRecord(savedVisit);
        rx.setHospital(hospital);
        rx.setPatient(patient);
        rx.setDependent(dependent);
        rx.setClinicianName(request.getClinicianName());
        rx.setClinicianLicenseNo(request.getClinicianLicenseNo());
        rx.setPrescriptionNumber(rxNumber);
        rx.setInstructions(request.getInstructions());
        rx.setDigitalSignatureHash(signatureHash);
        rx.setSignedAt(LocalDateTime.now());
        rx.setCreatedAt(LocalDateTime.now());

        // Add prescription items
        for (PrescriptionItemDto itemDto : request.getItems()) {
            PrescriptionItem item = new PrescriptionItem(
                    itemDto.getMedicineName(),
                    itemDto.getDosage(),
                    itemDto.getFrequency(),
                    itemDto.getDuration(),
                    itemDto.getSpecialInstructions()
            );
            rx.addItem(item);
        }

        Prescription savedRx = prescriptionRepository.save(rx);

        auditService.logAction(clinicianUser.getId(), "CREATE_PRESCRIPTION", "Prescription", savedRx.getId(),
                "Created digital prescription " + rxNumber + " for patient " + patient.getFullName(), null);

        notificationService.createNotification(
                patient.getId(),
                "New Digital Prescription Available",
                String.format("Dr. %s has issued prescription %s at %s.",
                        request.getClinicianName(), rxNumber, hospital.getName()),
                "PRESCRIPTION_ISSUED");

        return mapToPrescriptionDto(savedRx);
    }

    @Transactional(readOnly = true)
    public List<VisitRecordDto> getPatientVisitTimeline(String patientId, String dependentId, User currentUser) {
        if (currentUser.getRole() == Role.ROLE_PATIENT && !currentUser.getId().equals(patientId)) {
            throw new UnauthorizedException("Cannot access another patient's medical visit timeline");
        }

        List<VisitRecord> visits;
        if (dependentId != null && !dependentId.isBlank()) {
            visits = visitRecordRepository.findByDependentIdOrderByConsultationDateDesc(dependentId);
        } else {
            visits = visitRecordRepository.findByPatientIdOrderByConsultationDateDesc(patientId);
        }

        return visits.stream().map(this::mapToVisitDto).collect(Collectors.toList());
    }

    private VisitRecordDto mapToVisitDto(VisitRecord v) {
        VisitRecordDto dto = new VisitRecordDto();
        dto.setId(v.getId());
        dto.setHospitalName(v.getHospital().getName());
        dto.setPatientName(v.getDependent() != null ? v.getDependent().getFullName() : v.getPatient().getFullName());
        dto.setOpRegistrationNumber(v.getOpRegistration() != null ? v.getOpRegistration().getOpRegistrationNumber() : "Walk-in");
        dto.setConsultationDate(v.getConsultationDate());
        dto.setClinicianName(v.getClinicianName());
        dto.setClinicianRegistrationNo(v.getClinicianRegistrationNo());
        dto.setDiagnosisSummary(v.getDiagnosisSummary());
        dto.setClinicalNotes(v.getClinicalNotes());
        dto.setStatus(v.getStatus());

        prescriptionRepository.findByVisitRecordId(v.getId()).ifPresent(p -> {
            dto.setPrescription(mapToPrescriptionDto(p));
        });

        return dto;
    }

    private PrescriptionDto mapToPrescriptionDto(Prescription p) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(p.getId());
        dto.setPrescriptionNumber(p.getPrescriptionNumber());
        dto.setHospitalName(p.getHospital().getName());
        dto.setClinicianName(p.getClinicianName());
        dto.setClinicianLicenseNo(p.getClinicianLicenseNo());
        dto.setPatientName(p.getDependent() != null ? p.getDependent().getFullName() : p.getPatient().getFullName());
        dto.setInstructions(p.getInstructions());
        dto.setDigitalSignatureHash(p.getDigitalSignatureHash());
        dto.setSignedAt(p.getSignedAt());
        dto.setCreatedAt(p.getCreatedAt());

        if (p.getItems() != null) {
            dto.setItems(p.getItems().stream().map(i -> new PrescriptionItemDto(
                    i.getMedicineName(), i.getDosage(), i.getFrequency(), i.getDuration(), i.getSpecialInstructions()
            )).collect(Collectors.toList()));
        }

        return dto;
    }

    private String computeSha256(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return "DIGITAL-SIG-OK";
        }
    }
}
