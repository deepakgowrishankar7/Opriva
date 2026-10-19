package com.opriva.repository;

import com.opriva.entity.VisitRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRecordRepository extends JpaRepository<VisitRecord, String> {
    List<VisitRecord> findByPatientIdOrderByConsultationDateDesc(String patientId);
    List<VisitRecord> findByHospitalIdOrderByConsultationDateDesc(String hospitalId);
    List<VisitRecord> findByDependentIdOrderByConsultationDateDesc(String dependentId);
}
