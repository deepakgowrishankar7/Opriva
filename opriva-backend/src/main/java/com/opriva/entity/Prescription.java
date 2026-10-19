package com.opriva.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visit_record_id", nullable = false)
    private VisitRecord visitRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dependent_id")
    private Dependent dependent;

    @Column(name = "clinician_name", nullable = false, length = 150)
    private String clinicianName;

    @Column(name = "clinician_license_no", length = 100)
    private String clinicianLicenseNo;

    @Column(name = "prescription_number", nullable = false, unique = true, length = 50)
    private String prescriptionNumber;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "digital_signature_hash", length = 255)
    private String digitalSignatureHash;

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<PrescriptionItem> items = new ArrayList<>();

    public Prescription() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public void addItem(PrescriptionItem item) {
        items.add(item);
        item.setPrescription(this);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public VisitRecord getVisitRecord() { return visitRecord; }
    public void setVisitRecord(VisitRecord visitRecord) { this.visitRecord = visitRecord; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }

    public Dependent getDependent() { return dependent; }
    public void setDependent(Dependent dependent) { this.dependent = dependent; }

    public String getClinicianName() { return clinicianName; }
    public void setClinicianName(String clinicianName) { this.clinicianName = clinicianName; }

    public String getClinicianLicenseNo() { return clinicianLicenseNo; }
    public void setClinicianLicenseNo(String clinicianLicenseNo) { this.clinicianLicenseNo = clinicianLicenseNo; }

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getDigitalSignatureHash() { return digitalSignatureHash; }
    public void setDigitalSignatureHash(String digitalSignatureHash) { this.digitalSignatureHash = digitalSignatureHash; }

    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<PrescriptionItem> getItems() { return items; }
    public void setItems(List<PrescriptionItem> items) { this.items = items; }
}
