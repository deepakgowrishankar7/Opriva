package com.opriva.repository;

import com.opriva.entity.SlotReservation;
import com.opriva.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SlotReservationRepository extends JpaRepository<SlotReservation, String> {
    List<SlotReservation> findByPatientIdAndStatus(String patientId, ReservationStatus status);
    List<SlotReservation> findByStatusAndExpiresAtBefore(ReservationStatus status, LocalDateTime threshold);
    long countByHospitalIdAndSessionDateAndSlotTimeAndStatus(String hospitalId, LocalDate sessionDate, String slotTime, ReservationStatus status);
}
