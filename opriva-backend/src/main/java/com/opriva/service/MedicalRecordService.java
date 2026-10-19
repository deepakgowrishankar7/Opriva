package com.opriva.service;

import com.opriva.dto.MedicalRecordDtos.*;
import com.opriva.entity.*;
import com.opriva.enums.DocumentCategory;
import com.opriva.enums.Role;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.exception.UnauthorizedException;
import com.opriva.repository.*;
import com.opriva.service.adapter.DocumentStorageAdapter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    private final MedicalDocumentRepository medicalDocumentRepository;
    private final DocumentSharingGrantRepository documentSharingGrantRepository;
    private final DependentRepository dependentRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final DocumentStorageAdapter storageAdapter;
    private final AuditService auditService;

    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf", "image/jpeg", "image/png", "image/jpg");
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

    public MedicalRecordService(
            MedicalDocumentRepository medicalDocumentRepository,
            DocumentSharingGrantRepository documentSharingGrantRepository,
            DependentRepository dependentRepository,
            HospitalRepository hospitalRepository,
            UserRepository userRepository,
            DocumentStorageAdapter storageAdapter,
            AuditService auditService) {
        this.medicalDocumentRepository = medicalDocumentRepository;
        this.documentSharingGrantRepository = documentSharingGrantRepository;
        this.dependentRepository = dependentRepository;
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
        this.storageAdapter = storageAdapter;
        this.auditService = auditService;
    }

    @Transactional
    public MedicalDocumentDto uploadDocument(
            MultipartFile file,
            DocumentCategory category,
            LocalDate documentDate,
            String description,
            String dependentId,
            User currentUser) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 15MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported file type. Only PDF, JPEG, and PNG are permitted.");
        }

        Dependent dependent = null;
        if (dependentId != null && !dependentId.isBlank()) {
            dependent = dependentRepository.findById(dependentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Dependent profile not found: " + dependentId));
            if (!dependent.getPrimaryPatient().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("Unauthorized access to dependent profile");
            }
        }

        String docId = UUID.randomUUID().toString();
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "report.pdf";
        // Sanitize filename
        String safeName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storageKey = "doc_" + docId + "_" + safeName;

        try {
            storageAdapter.storeFile(storageKey, file.getBytes(), contentType);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file content for secure storage", e);
        }

        MedicalDocument doc = new MedicalDocument();
        doc.setId(docId);
        doc.setPatient(currentUser);
        doc.setDependent(dependent);
        doc.setFileName(safeName);
        doc.setFileSize(file.getSize());
        doc.setContentType(contentType);
        doc.setStorageKey(storageKey);
        doc.setDocumentCategory(category != null ? category : DocumentCategory.OTHER);
        doc.setDocumentDate(documentDate != null ? documentDate : LocalDate.now());
        doc.setDescription(description);
        doc.setUploadedByUser(currentUser);
        doc.setCreatedAt(LocalDateTime.now());

        MedicalDocument saved = medicalDocumentRepository.save(doc);

        auditService.logAction(currentUser.getId(), "UPLOAD_MEDICAL_DOCUMENT", "MedicalDocument", saved.getId(),
                "Uploaded medical report: " + safeName + " (" + (file.getSize() / 1024) + " KB)", null);

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<MedicalDocumentDto> getPatientDocuments(String patientId, String dependentId, User currentUser) {
        // Enforce object-level authorization: users can only view their own documents or authorized clinicians with grant
        if (currentUser.getRole() == Role.ROLE_PATIENT && !currentUser.getId().equals(patientId)) {
            throw new UnauthorizedException("Cannot access another patient's medical reports");
        }

        List<MedicalDocument> documents;
        if (dependentId != null && !dependentId.isBlank()) {
            documents = medicalDocumentRepository.findByDependentIdOrderByCreatedAtDesc(dependentId);
        } else {
            documents = medicalDocumentRepository.findByPatientIdAndDependentIsNullOrderByCreatedAtDesc(patientId);
        }

        return documents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public byte[] retrieveDocumentFile(String documentId, User currentUser) {
        MedicalDocument doc = medicalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical document not found: " + documentId));

        // Authorization check: document owner, dependent owner, or authorized clinician
        boolean isOwner = doc.getPatient().getId().equals(currentUser.getId());
        boolean isClinician = (currentUser.getRole() == Role.ROLE_CLINICIAN || currentUser.getRole() == Role.ROLE_SUPPORT);

        if (!isOwner && !isClinician) {
            throw new UnauthorizedException("You are not authorized to view this medical document");
        }

        auditService.logAction(currentUser.getId(), "VIEW_MEDICAL_DOCUMENT", "MedicalDocument", doc.getId(),
                "Accessed medical document: " + doc.getFileName(), null);

        return storageAdapter.retrieveFile(doc.getStorageKey());
    }

    @Transactional
    public void shareDocumentWithHospital(ShareDocumentRequest request, User currentUser) {
        MedicalDocument doc = medicalDocumentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + request.getDocumentId()));

        if (!doc.getPatient().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized to share this document");
        }

        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found: " + request.getHospitalId()));

        DocumentSharingGrant grant = new DocumentSharingGrant();
        grant.setId(UUID.randomUUID().toString());
        grant.setMedicalDocument(doc);
        grant.setHospital(hospital);
        grant.setGrantedAt(LocalDateTime.now());
        grant.setExpiresAt(LocalDateTime.now().plusDays(30)); // 30-day clinical consultation grant
        grant.setRevoked(false);

        documentSharingGrantRepository.save(grant);

        auditService.logAction(currentUser.getId(), "SHARE_MEDICAL_DOCUMENT", "DocumentSharingGrant", grant.getId(),
                "Shared report " + doc.getFileName() + " with " + hospital.getName(), null);
    }

    private MedicalDocumentDto mapToDto(MedicalDocument doc) {
        MedicalDocumentDto dto = new MedicalDocumentDto();
        dto.setId(doc.getId());
        dto.setFileName(doc.getFileName());
        dto.setFileSize(doc.getFileSize());
        dto.setContentType(doc.getContentType());
        dto.setDocumentCategory(doc.getDocumentCategory());
        dto.setDocumentDate(doc.getDocumentDate());
        dto.setDescription(doc.getDescription());
        dto.setOwnerName(doc.getDependent() != null ? doc.getDependent().getFullName() : doc.getPatient().getFullName());
        dto.setDependentId(doc.getDependent() != null ? doc.getDependent().getId() : null);
        dto.setDownloadUrl("/api/v1/documents/" + doc.getId() + "/download");
        dto.setUploadedAt(doc.getCreatedAt());
        return dto;
    }
}
