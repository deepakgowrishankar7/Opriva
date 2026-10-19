package com.opriva.repository;

import com.opriva.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);
    Optional<Prescription> findByVisitRecordId(String visitRecordId);
    List<Prescription> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<Prescription> findByDependentIdOrderByCreatedAtDesc(String dependentId);
}
