package com.opriva.repository;

import com.opriva.entity.OpRegistration;
import com.opriva.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpRegistrationRepository extends JpaRepository<OpRegistration, String> {
    Optional<OpRegistration> findByOpRegistrationNumber(String opRegistrationNumber);
    List<OpRegistration> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<OpRegistration> findByHospitalIdAndSessionDate(String hospitalId, LocalDate sessionDate);

    @Query("SELECT COUNT(r) FROM OpRegistration r WHERE r.hospital.id = :hospitalId AND r.sessionDate = :sessionDate")
    long countByHospitalAndDate(@Param("hospitalId") String hospitalId, @Param("sessionDate") LocalDate sessionDate);

    @Query("SELECT r FROM OpRegistration r WHERE r.hospital.id = :hospitalId AND " +
           "(LOWER(r.opRegistrationNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.patient.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "r.patient.phone LIKE CONCAT('%', :query, '%'))")
    List<OpRegistration> searchHospitalRegistrations(@Param("hospitalId") String hospitalId, @Param("query") String query);
}
