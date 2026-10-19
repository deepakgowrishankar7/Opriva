package com.opriva.entity;

import com.opriva.enums.RegistrationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "op_registrations")
public class OpRegistration {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "op_registration_type_id", nullable = false)
    private OpRegistrationType opRegistrationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dependent_id")
    private Dependent dependent;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_reservation_id")
    private SlotReservation slotReservation;

    @Column(name = "op_registration_number", nullable = false, unique = true, length = 50)
    private String opRegistrationNumber;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;

    @Column(name = "fee_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal feePaid;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RegistrationStatus status = RegistrationStatus.CONFIRMED;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public OpRegistration() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public OpRegistrationType getOpRegistrationType() { return opRegistrationType; }
    public void setOpRegistrationType(OpRegistrationType opRegistrationType) { this.opRegistrationType = opRegistrationType; }

    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }

    public Dependent getDependent() { return dependent; }
    public void setDependent(Dependent dependent) { this.dependent = dependent; }

    public SlotReservation getSlotReservation() { return slotReservation; }
    public void setSlotReservation(SlotReservation slotReservation) { this.slotReservation = slotReservation; }

    public String getOpRegistrationNumber() { return opRegistrationNumber; }
    public void setOpRegistrationNumber(String opRegistrationNumber) { this.opRegistrationNumber = opRegistrationNumber; }

    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

    public BigDecimal getFeePaid() { return feePaid; }
    public void setFeePaid(BigDecimal feePaid) { this.feePaid = feePaid; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public RegistrationStatus getStatus() { return status; }
    public void setStatus(RegistrationStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
