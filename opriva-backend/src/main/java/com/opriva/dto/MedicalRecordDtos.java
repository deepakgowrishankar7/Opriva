package com.opriva.dto;

import com.opriva.enums.DocumentCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MedicalRecordDtos {

    public static class MedicalDocumentDto {
        private String id;
        private String fileName;
        private Long fileSize;
        private String contentType;
        private DocumentCategory documentCategory;
        private LocalDate documentDate;
        private String description;
        private String ownerName;
        private String dependentId;
        private String downloadUrl;
        private LocalDateTime uploadedAt;

        public MedicalDocumentDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }

        public DocumentCategory getDocumentCategory() { return documentCategory; }
        public void setDocumentCategory(DocumentCategory documentCategory) { this.documentCategory = documentCategory; }

        public LocalDate getDocumentDate() { return documentDate; }
        public void setDocumentDate(LocalDate documentDate) { this.documentDate = documentDate; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

        public String getDependentId() { return dependentId; }
        public void setDependentId(String dependentId) { this.dependentId = dependentId; }

        public String getDownloadUrl() { return downloadUrl; }
        public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

        public LocalDateTime getUploadedAt() { return uploadedAt; }
        public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    }

    public static class ShareDocumentRequest {
        @NotBlank(message = "Document ID is required")
        private String documentId;

        @NotBlank(message = "Hospital ID is required")
        private String hospitalId;

        public ShareDocumentRequest() {}

        public String getDocumentId() { return documentId; }
        public void setDocumentId(String documentId) { this.documentId = documentId; }

        public String getHospitalId() { return hospitalId; }
        public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }
    }

    public static class PrescriptionItemDto {
        private String medicineName;
        private String dosage;
        private String frequency;
        private String duration;
        private String specialInstructions;

        public PrescriptionItemDto() {}
        public PrescriptionItemDto(String medicineName, String dosage, String frequency, String duration, String specialInstructions) {
            this.medicineName = medicineName;
            this.dosage = dosage;
            this.frequency = frequency;
            this.duration = duration;
            this.specialInstructions = specialInstructions;
        }

        public String getMedicineName() { return medicineName; }
        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }

        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }

        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }

        public String getSpecialInstructions() { return specialInstructions; }
        public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    }

    public static class PrescriptionDto {
        private String id;
        private String prescriptionNumber;
        private String hospitalName;
        private String clinicianName;
        private String clinicianLicenseNo;
        private String patientName;
        private String instructions;
        private String digitalSignatureHash;
        private LocalDateTime signedAt;
        private LocalDateTime createdAt;
        private List<PrescriptionItemDto> items;

        public PrescriptionDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getPrescriptionNumber() { return prescriptionNumber; }
        public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

        public String getHospitalName() { return hospitalName; }
        public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

        public String getClinicianName() { return clinicianName; }
        public void setClinicianName(String clinicianName) { this.clinicianName = clinicianName; }

        public String getClinicianLicenseNo() { return clinicianLicenseNo; }
        public void setClinicianLicenseNo(String clinicianLicenseNo) { this.clinicianLicenseNo = clinicianLicenseNo; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }

        public String getDigitalSignatureHash() { return digitalSignatureHash; }
        public void setDigitalSignatureHash(String digitalSignatureHash) { this.digitalSignatureHash = digitalSignatureHash; }

        public LocalDateTime getSignedAt() { return signedAt; }
        public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public List<PrescriptionItemDto> getItems() { return items; }
        public void setItems(List<PrescriptionItemDto> items) { this.items = items; }
    }

    public static class CreatePrescriptionRequest {
        @NotBlank(message = "Hospital ID is required")
        private String hospitalId;

        @NotBlank(message = "Patient ID is required")
        private String patientId;

        private String dependentId;
        private String opRegistrationId;

        @NotBlank(message = "Clinician Name is required")
        private String clinicianName;

        @NotBlank(message = "Clinician License is required")
        private String clinicianLicenseNo;

        @NotBlank(message = "Diagnosis summary is required")
        private String diagnosisSummary;

        private String clinicalNotes;
        private String instructions;

        @NotEmpty(message = "Prescription must contain at least one item")
        private List<PrescriptionItemDto> items;

        public CreatePrescriptionRequest() {}

        public String getHospitalId() { return hospitalId; }
        public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getDependentId() { return dependentId; }
        public void setDependentId(String dependentId) { this.dependentId = dependentId; }

        public String getOpRegistrationId() { return opRegistrationId; }
        public void setOpRegistrationId(String opRegistrationId) { this.opRegistrationId = opRegistrationId; }

        public String getClinicianName() { return clinicianName; }
        public void setClinicianName(String clinicianName) { this.clinicianName = clinicianName; }

        public String getClinicianLicenseNo() { return clinicianLicenseNo; }
        public void setClinicianLicenseNo(String clinicianLicenseNo) { this.clinicianLicenseNo = clinicianLicenseNo; }

        public String getDiagnosisSummary() { return diagnosisSummary; }
        public void setDiagnosisSummary(String diagnosisSummary) { this.diagnosisSummary = diagnosisSummary; }

        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }

        public List<PrescriptionItemDto> getItems() { return items; }
        public void setItems(List<PrescriptionItemDto> items) { this.items = items; }
    }

    public static class VisitRecordDto {
        private String id;
        private String hospitalName;
        private String patientName;
        private String opRegistrationNumber;
        private LocalDate consultationDate;
        private String clinicianName;
        private String clinicianRegistrationNo;
        private String diagnosisSummary;
        private String clinicalNotes;
        private String status;
        private PrescriptionDto prescription;

        public VisitRecordDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getHospitalName() { return hospitalName; }
        public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getOpRegistrationNumber() { return opRegistrationNumber; }
        public void setOpRegistrationNumber(String opRegistrationNumber) { this.opRegistrationNumber = opRegistrationNumber; }

        public LocalDate getConsultationDate() { return consultationDate; }
        public void setConsultationDate(LocalDate consultationDate) { this.consultationDate = consultationDate; }

        public String getClinicianName() { return clinicianName; }
        public void setClinicianName(String clinicianName) { this.clinicianName = clinicianName; }

        public String getClinicianRegistrationNo() { return clinicianRegistrationNo; }
        public void setClinicianRegistrationNo(String clinicianRegistrationNo) { this.clinicianRegistrationNo = clinicianRegistrationNo; }

        public String getDiagnosisSummary() { return diagnosisSummary; }
        public void setDiagnosisSummary(String diagnosisSummary) { this.diagnosisSummary = diagnosisSummary; }

        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public PrescriptionDto getPrescription() { return prescription; }
        public void setPrescription(PrescriptionDto prescription) { this.prescription = prescription; }
    }

    public static class DependentDto {
        private String id;
        private String fullName;
        private String relationship;
        private LocalDate dateOfBirth;
        private String gender;
        private String bloodGroup;

        public DependentDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getRelationship() { return relationship; }
        public void setRelationship(String relationship) { this.relationship = relationship; }

        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getBloodGroup() { return bloodGroup; }
        public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    }

    public static class CreateDependentRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Relationship is required (e.g. Mother, Father, Child, Spouse)")
        private String relationship;

        private LocalDate dateOfBirth;
        private String gender;
        private String bloodGroup;

        public CreateDependentRequest() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getRelationship() { return relationship; }
        public void setRelationship(String relationship) { this.relationship = relationship; }

        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getBloodGroup() { return bloodGroup; }
        public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    }

    public static class NotificationDto {
        private String id;
        private String title;
        private String message;
        private String notificationType;
        private boolean read;
        private LocalDateTime createdAt;

        public NotificationDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getNotificationType() { return notificationType; }
        public void setNotificationType(String notificationType) { this.notificationType = notificationType; }

        public boolean isRead() { return read; }
        public void setRead(boolean read) { this.read = read; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
