package com.opriva.repository;

import com.opriva.entity.DocumentSharingGrant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentSharingGrantRepository extends JpaRepository<DocumentSharingGrant, String> {
    List<DocumentSharingGrant> findByHospitalIdAndRevokedFalse(String hospitalId);
    List<DocumentSharingGrant> findByMedicalDocumentId(String medicalDocumentId);
}
