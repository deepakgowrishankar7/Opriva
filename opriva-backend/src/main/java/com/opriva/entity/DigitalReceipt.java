package com.opriva.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "digital_receipts")
public class DigitalReceipt {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "op_registration_id", nullable = false, unique = true)
    private OpRegistration opRegistration;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 50)
    private String receiptNumber;

    @Column(name = "hospital_name", nullable = false, length = 200)
    private String hospitalName;

    @Column(name = "patient_name", nullable = false, length = 150)
    private String patientName;

    @Column(name = "registration_type_name", nullable = false, length = 100)
    private String registrationTypeName;

    @Column(name = "fee_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal feePaid;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(name = "payment_reference", nullable = false, length = 100)
    private String paymentReference;

    @Column(name = "token_number", nullable = false, length = 30)
    private String tokenNumber;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    public DigitalReceipt() {}

    @PrePersist
    protected void onCreate() {
        if (issuedAt == null) issuedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public OpRegistration getOpRegistration() { return opRegistration; }
    public void setOpRegistration(OpRegistration opRegistration) { this.opRegistration = opRegistration; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getRegistrationTypeName() { return registrationTypeName; }
    public void setRegistrationTypeName(String registrationTypeName) { this.registrationTypeName = registrationTypeName; }

    public BigDecimal getFeePaid() { return feePaid; }
    public void setFeePaid(BigDecimal feePaid) { this.feePaid = feePaid; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
}
