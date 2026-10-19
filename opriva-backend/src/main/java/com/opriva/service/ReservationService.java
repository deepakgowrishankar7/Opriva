package com.opriva.service;

import com.opriva.dto.RegistrationDtos.CreateReservationRequest;
import com.opriva.dto.RegistrationDtos.ReservationResponse;
import com.opriva.entity.*;
import com.opriva.enums.ReservationStatus;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private final SlotReservationRepository slotReservationRepository;
    private final HospitalRepository hospitalRepository;
    private final OpRegistrationTypeRepository opRegistrationTypeRepository;
    private final UserRepository userRepository;
    private final DependentRepository dependentRepository;

    public ReservationService(
            SlotReservationRepository slotReservationRepository,
            HospitalRepository hospitalRepository,
            OpRegistrationTypeRepository opRegistrationTypeRepository,
            UserRepository userRepository,
            DependentRepository dependentRepository) {
        this.slotReservationRepository = slotReservationRepository;
        this.hospitalRepository = hospitalRepository;
        this.opRegistrationTypeRepository = opRegistrationTypeRepository;
        this.userRepository = userRepository;
        this.dependentRepository = dependentRepository;
    }

    @Transactional
    public ReservationResponse createReservation(CreateReservationRequest request, String userId) {
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found: " + request.getHospitalId()));

        OpRegistrationType registrationType = opRegistrationTypeRepository.findById(request.getOpRegistrationTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Registration type not found: " + request.getOpRegistrationTypeId()));

        User patient = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + userId));

        Dependent dependent = null;
        if (request.getDependentId() != null && !request.getDependentId().isBlank()) {
            dependent = dependentRepository.findById(request.getDependentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dependent not found: " + request.getDependentId()));
            if (!dependent.getPrimaryPatient().getId().equals(userId)) {
                throw new SecurityException("Unauthorized access to dependent profile");
            }
        }

        // Create temporary reservation expiring in 10 minutes
        SlotReservation reservation = new SlotReservation();
        reservation.setId(UUID.randomUUID().toString());
        reservation.setHospital(hospital);
        reservation.setOpRegistrationType(registrationType);
        reservation.setPatient(patient);
        reservation.setDependent(dependent);
        reservation.setSessionDate(request.getSessionDate());
        reservation.setSlotTime(request.getSlotTime());
        reservation.setStatus(ReservationStatus.RESERVED);
        reservation.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        reservation.setCreatedAt(LocalDateTime.now());

        SlotReservation saved = slotReservationRepository.save(reservation);

        ReservationResponse response = new ReservationResponse();
        response.setReservationId(saved.getId());
        response.setHospitalName(hospital.getName());
        response.setRegistrationTypeName(registrationType.getDisplayName());
        response.setPatientName(dependent != null ? dependent.getFullName() : patient.getFullName());
        response.setSessionDate(saved.getSessionDate());
        response.setSlotTime(saved.getSlotTime());
        response.setFeeAmount(registrationType.getFeeAmount());
        response.setCurrency(registrationType.getCurrency());
        response.setExpiresAt(saved.getExpiresAt());
        response.setStatus(saved.getStatus().name());

        return response;
    }

    @Scheduled(fixedRate = 60000) // check every minute
    @Transactional
    public void expireStaleReservations() {
        List<SlotReservation> expiredList = slotReservationRepository.findByStatusAndExpiresAtBefore(
                ReservationStatus.RESERVED, LocalDateTime.now());
        for (SlotReservation r : expiredList) {
            r.setStatus(ReservationStatus.EXPIRED);
        }
        if (!expiredList.isEmpty()) {
            slotReservationRepository.saveAll(expiredList);
        }
    }
}
