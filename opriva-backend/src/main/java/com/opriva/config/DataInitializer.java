package com.opriva.config;

import com.opriva.entity.*;
import com.opriva.enums.*;
import com.opriva.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DependentRepository dependentRepository;
    private final HospitalRepository hospitalRepository;
    private final OpRegistrationTypeRepository opRegistrationTypeRepository;
    private final OpRegistrationRepository opRegistrationRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final QueueStateHistoryRepository queueStateHistoryRepository;
    private final DigitalReceiptRepository digitalReceiptRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PatientProfileRepository patientProfileRepository,
            DependentRepository dependentRepository,
            HospitalRepository hospitalRepository,
            OpRegistrationTypeRepository opRegistrationTypeRepository,
            OpRegistrationRepository opRegistrationRepository,
            QueueTokenRepository queueTokenRepository,
            QueueStateHistoryRepository queueStateHistoryRepository,
            DigitalReceiptRepository digitalReceiptRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.dependentRepository = dependentRepository;
        this.hospitalRepository = hospitalRepository;
        this.opRegistrationTypeRepository = opRegistrationTypeRepository;
        this.opRegistrationRepository = opRegistrationRepository;
        this.queueTokenRepository = queueTokenRepository;
        this.queueStateHistoryRepository = queueStateHistoryRepository;
        this.digitalReceiptRepository = digitalReceiptRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing Opriva default users and session queue data...");

        // 1. Receptionist Demo User
        User receptionist = getOrCreateUser(
                "usr-rec-001",
                "receptionist@apollo.opriva.com",
                "9876543210",
                "Lakshmi Narayana (OP Reception)",
                Role.ROLE_RECEPTIONIST);

        // 2. Clinician Demo User
        User clinician = getOrCreateUser(
                "usr-doc-001",
                "dr.sharma@apollo.opriva.com",
                "9876543211",
                "Dr. Rajesh Sharma, MD",
                Role.ROLE_CLINICIAN);

        // 3. Patient Demo User
        User patient = getOrCreateUser(
                "usr-pat-001",
                "patient@opriva.com",
                "9876543212",
                "Ananya Reddy",
                Role.ROLE_PATIENT);

        // Patient Profile
        if (patientProfileRepository.findByUserId(patient.getId()).isEmpty()) {
            PatientProfile profile = new PatientProfile();
            profile.setId(UUID.randomUUID().toString());
            profile.setUser(patient);
            profile.setDateOfBirth(LocalDate.of(1994, 6, 15));
            profile.setGender("Female");
            profile.setBloodGroup("O+");
            profile.setAddress("Banjara Hills, Hyderabad, Telangana");
            profile.setEmergencyContact("+91-9876543299");
            profile.setCreatedAt(LocalDateTime.now());
            profile.setUpdatedAt(LocalDateTime.now());
            patientProfileRepository.save(profile);
        }

        // Dependent profile for demo patient
        if (dependentRepository.findByPrimaryPatientId(patient.getId()).isEmpty()) {
            Dependent dep = new Dependent();
            dep.setId("dep-001");
            dep.setPrimaryPatient(patient);
            dep.setFullName("Rohan Reddy");
            dep.setRelationship("Child");
            dep.setDateOfBirth(LocalDate.of(2018, 9, 21));
            dep.setGender("Male");
            dep.setBloodGroup("O+");
            dep.setCreatedAt(LocalDateTime.now());
            dep.setUpdatedAt(LocalDateTime.now());
            dependentRepository.save(dep);
        }

        // 4. Platform Support Demo User
        getOrCreateUser(
                "usr-sup-001",
                "support@opriva.com",
                "9876543213",
                "Opriva Platform Support",
                Role.ROLE_SUPPORT);

        // 5. Seed sample queue tokens for today at Apollo Health City (hosp-001) if empty
        LocalDate today = LocalDate.now();
        long tokenCount = queueTokenRepository.findByHospitalIdAndSessionDateOrderByPriorityWeightDescTokenSequenceAsc("hosp-001", today).size();
        if (tokenCount == 0) {
            seedSampleQueue("hosp-001", patient, receptionist);
        }

        log.info("Opriva initialization completed successfully.");
    }

    private User getOrCreateUser(String id, String email, String phone, String name, Role role) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) return existing.get();

        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setPhone(phone);
        user.setFullName(name);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setRole(role);
        user.setPreferredLanguage("en");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    private void seedSampleQueue(String hospitalId, User patient, User receptionist) {
        Hospital hospital = hospitalRepository.findById(hospitalId).orElse(null);
        if (hospital == null) return;

        OpRegistrationType normalType = opRegistrationTypeRepository.findByHospitalIdAndTypeCodeAndActiveTrue(
                hospitalId, RegistrationTypeCode.NORMAL).orElse(null);
        OpRegistrationType specialType = opRegistrationTypeRepository.findByHospitalIdAndTypeCodeAndActiveTrue(
                hospitalId, RegistrationTypeCode.SPECIAL).orElse(null);

        if (normalType == null || specialType == null) return;

        LocalDate today = LocalDate.now();

        // Token 1: Normal OP - Completed
        createTokenEntry(hospital, normalType, patient, "OPR-2026-HYD-001", "N-101", 1, today, QueueState.COMPLETED, 1, receptionist);
        // Token 2: Special OP - In Consultation
        createTokenEntry(hospital, specialType, patient, "OPR-2026-HYD-002", "S-201", 1, today, QueueState.IN_CONSULTATION, 2, receptionist);
        // Token 3: Special OP - Called
        createTokenEntry(hospital, specialType, patient, "OPR-2026-HYD-003", "S-202", 2, today, QueueState.CALLED, 2, receptionist);
        // Token 4: Normal OP - Waiting (Patient's token!)
        createTokenEntry(hospital, normalType, patient, "OPR-2026-HYD-004", "N-102", 2, today, QueueState.WAITING, 1, receptionist);
        // Token 5: Normal OP - Waiting
        createTokenEntry(hospital, normalType, patient, "OPR-2026-HYD-005", "N-103", 3, today, QueueState.WAITING, 1, receptionist);
    }

    private void createTokenEntry(
            Hospital hospital, OpRegistrationType type, User patient,
            String regNo, String tokenNo, int seq, LocalDate date, QueueState state, int priority, User receptionist) {

        OpRegistration reg = new OpRegistration();
        reg.setId(UUID.randomUUID().toString());
        reg.setHospital(hospital);
        reg.setOpRegistrationType(type);
        reg.setPatient(patient);
        reg.setOpRegistrationNumber(regNo);
        reg.setSessionDate(date);
        reg.setFeePaid(type.getFeeAmount());
        reg.setCurrency(type.getCurrency());
        reg.setStatus(RegistrationStatus.CONFIRMED);
        reg.setCreatedAt(LocalDateTime.now().minusHours(2));
        reg.setUpdatedAt(LocalDateTime.now());
        OpRegistration savedReg = opRegistrationRepository.save(reg);

        QueueToken token = new QueueToken();
        token.setId(UUID.randomUUID().toString());
        token.setHospital(hospital);
        token.setOpRegistration(savedReg);
        token.setOpRegistrationType(type);
        token.setTokenNumber(tokenNo);
        token.setTokenSequence(seq);
        token.setSessionDate(date);
        token.setQueueState(state);
        token.setPriorityWeight(priority);
        if (state == QueueState.CALLED || state == QueueState.IN_CONSULTATION || state == QueueState.COMPLETED) {
            token.setCalledAt(LocalDateTime.now().minusMinutes(20));
        }
        if (state == QueueState.IN_CONSULTATION || state == QueueState.COMPLETED) {
            token.setStartedAt(LocalDateTime.now().minusMinutes(15));
        }
        if (state == QueueState.COMPLETED) {
            token.setCompletedAt(LocalDateTime.now().minusMinutes(5));
        }
        token.setCreatedAt(LocalDateTime.now().minusHours(2));
        token.setUpdatedAt(LocalDateTime.now());
        QueueToken savedToken = queueTokenRepository.save(token);

        QueueStateHistory history = new QueueStateHistory();
        history.setId(UUID.randomUUID().toString());
        history.setQueueToken(savedToken);
        history.setToState(state);
        history.setChangedByUser(receptionist);
        history.setReason("Session initialization");
        history.setChangedAt(LocalDateTime.now());
        queueStateHistoryRepository.save(history);

        // Digital Receipt
        DigitalReceipt receipt = new DigitalReceipt();
        receipt.setId(UUID.randomUUID().toString());
        receipt.setOpRegistration(savedReg);
        receipt.setReceiptNumber("RCP-INIT-" + tokenNo);
        receipt.setHospitalName(hospital.getName());
        receipt.setPatientName(patient.getFullName());
        receipt.setRegistrationTypeName(type.getDisplayName());
        receipt.setFeePaid(type.getFeeAmount());
        receipt.setCurrency(type.getCurrency());
        receipt.setPaymentReference("TXN-" + tokenNo);
        receipt.setTokenNumber(tokenNo);
        receipt.setIssuedAt(LocalDateTime.now().minusHours(2));
        digitalReceiptRepository.save(receipt);
    }
}
