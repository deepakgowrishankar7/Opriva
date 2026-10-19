package com.opriva.repository;

import com.opriva.entity.MedicalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, String> {
    List<MedicalDocument> findByPatientIdAndDependentIsNullOrderByCreatedAtDesc(String patientId);
    List<MedicalDocument> findByDependentIdOrderByCreatedAtDesc(String dependentId);
    List<MedicalDocument> findByPatientIdOrderByCreatedAtDesc(String patientId);
}
