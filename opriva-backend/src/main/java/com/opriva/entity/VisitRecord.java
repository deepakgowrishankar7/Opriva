package com.opriva.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visit_records")
public class VisitRecord {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dependent_id")
    private Dependent dependent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "op_registration_id")
    private OpRegistration opRegistration;

    @Column(name = "consultation_date", nullable = false)
    private LocalDate consultationDate;

    @Column(name = "clinician_name", nullable = false, length = 150)
    private String clinicianName;

    @Column(name = "clinician_registration_no", length = 100)
    private String clinicianRegistrationNo;

    @Column(name = "diagnosis_summary", length = 500)
    private String diagnosisSummary;

    @Column(name = "clinical_notes", columnDefinition = "TEXT")
    private String clinicalNotes;

    @Column(nullable = false, length = 30)
    private String status = "COMPLETED";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public VisitRecord() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }

    public Dependent getDependent() { return dependent; }
    public void setDependent(Dependent dependent) { this.dependent = dependent; }

    public OpRegistration getOpRegistration() { return opRegistration; }
    public void setOpRegistration(OpRegistration opRegistration) { this.opRegistration = opRegistration; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
