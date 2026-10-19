package com.opriva.dto;

import com.opriva.enums.PaymentStatus;
import com.opriva.enums.QueueState;
import com.opriva.enums.RegistrationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RegistrationDtos {

    public static class CreateReservationRequest {
        @NotBlank(message = "Hospital ID is required")
        private String hospitalId;

        @NotBlank(message = "Registration Type ID is required")
        private String opRegistrationTypeId;

        private String dependentId; // Null if booking for primary user

        @NotNull(message = "Session date is required")
        private LocalDate sessionDate;

        @NotBlank(message = "Slot time is required")
        private String slotTime; // e.g. "09:00 - 10:00 AM"

        public CreateReservationRequest() {}

        public String getHospitalId() { return hospitalId; }
        public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

        public String getOpRegistrationTypeId() { return opRegistrationTypeId; }
        public void setOpRegistrationTypeId(String opRegistrationTypeId) { this.opRegistrationTypeId = opRegistrationTypeId; }

        public String getDependentId() { return dependentId; }
        public void setDependentId(String dependentId) { this.dependentId = dependentId; }

        public LocalDate getSessionDate() { return sessionDate; }
        public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

        public String getSlotTime() { return slotTime; }
        public void setSlotTime(String slotTime) { this.slotTime = slotTime; }
    }

    public static class ReservationResponse {
        private String reservationId;
        private String hospitalName;
        private String registrationTypeName;
        private String patientName;
        private LocalDate sessionDate;
        private String slotTime;
        private BigDecimal feeAmount;
        private String currency;
        private LocalDateTime expiresAt;
        private String status;

        public ReservationResponse() {}

        public String getReservationId() { return reservationId; }
        public void setReservationId(String reservationId) { this.reservationId = reservationId; }

        public String getHospitalName() { return hospitalName; }
        public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

        public String getRegistrationTypeName() { return registrationTypeName; }
        public void setRegistrationTypeName(String registrationTypeName) { this.registrationTypeName = registrationTypeName; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public LocalDate getSessionDate() { return sessionDate; }
        public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

        public String getSlotTime() { return slotTime; }
        public void setSlotTime(String slotTime) { this.slotTime = slotTime; }

        public BigDecimal getFeeAmount() { return feeAmount; }
        public void setFeeAmount(BigDecimal feeAmount) { this.feeAmount = feeAmount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class VerifyPaymentRequest {
        @NotBlank(message = "Reservation ID is required")
        private String reservationId;

        @NotBlank(message = "Provider Order ID is required")
        private String providerOrderId;

        @NotBlank(message = "Provider Payment ID is required")
        private String providerPaymentId;

        private String providerSignature;

        public VerifyPaymentRequest() {}

        public String getReservationId() { return reservationId; }
        public void setReservationId(String reservationId) { this.reservationId = reservationId; }

        public String getProviderOrderId() { return providerOrderId; }
        public void setProviderOrderId(String providerOrderId) { this.providerOrderId = providerOrderId; }

        public String getProviderPaymentId() { return providerPaymentId; }
        public void setProviderPaymentId(String providerPaymentId) { this.providerPaymentId = providerPaymentId; }

        public String getProviderSignature() { return providerSignature; }
        public void setProviderSignature(String providerSignature) { this.providerSignature = providerSignature; }
    }

    public static class RegistrationConfirmationDto {
        private String registrationId;
        private String opRegistrationNumber; // Unique app generated: OPR-2026-HYD-001
        private String tokenNumber;          // Queue token: N-101 or S-201
        private String hospitalName;
        private String patientName;
        private String registrationType;
        private LocalDate sessionDate;
        private BigDecimal feePaid;
        private String currency;
        private QueueState queueState;
        private String digitalReceiptNumber;
        private LocalDateTime confirmedAt;

        public RegistrationConfirmationDto() {}

        public String getRegistrationId() { return registrationId; }
        public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }

        public String getOpRegistrationNumber() { return opRegistrationNumber; }
        public void setOpRegistrationNumber(String opRegistrationNumber) { this.opRegistrationNumber = opRegistrationNumber; }

        public String getTokenNumber() { return tokenNumber; }
        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

        public String getHospitalName() { return hospitalName; }
        public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getRegistrationType() { return registrationType; }
        public void setRegistrationType(String registrationType) { this.registrationType = registrationType; }

        public LocalDate getSessionDate() { return sessionDate; }
        public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

        public BigDecimal getFeePaid() { return feePaid; }
        public void setFeePaid(BigDecimal feePaid) { this.feePaid = feePaid; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public QueueState getQueueState() { return queueState; }
        public void setQueueState(QueueState queueState) { this.queueState = queueState; }

        public String getDigitalReceiptNumber() { return digitalReceiptNumber; }
        public void setDigitalReceiptNumber(String digitalReceiptNumber) { this.digitalReceiptNumber = digitalReceiptNumber; }

        public LocalDateTime getConfirmedAt() { return confirmedAt; }
        public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
    }

    public static class DigitalReceiptDto {
        private String receiptNumber;
        private String opRegistrationNumber;
        private String tokenNumber;
        private String hospitalName;
        private String patientName;
        private String registrationTypeName;
        private BigDecimal feePaid;
        private String currency;
        private String paymentReference;
        private LocalDateTime issuedAt;

        public DigitalReceiptDto() {}

        public String getReceiptNumber() { return receiptNumber; }
        public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

        public String getOpRegistrationNumber() { return opRegistrationNumber; }
        public void setOpRegistrationNumber(String opRegistrationNumber) { this.opRegistrationNumber = opRegistrationNumber; }

        public String getTokenNumber() { return tokenNumber; }
        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

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

        public LocalDateTime getIssuedAt() { return issuedAt; }
        public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
    }

    public static class WalkInRegistrationRequest {
        @NotBlank(message = "Patient name is required")
        private String patientName;

        @NotBlank(message = "Patient phone is required")
        private String patientPhone;

        @NotBlank(message = "Hospital ID is required")
        private String hospitalId;

        @NotBlank(message = "Registration Type ID is required")
        private String opRegistrationTypeId;

        private String paymentMethod = "CASH_COUNTER"; // CASH_COUNTER, UPI_COUNTER, CARD_COUNTER

        public WalkInRegistrationRequest() {}

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getPatientPhone() { return patientPhone; }
        public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

        public String getHospitalId() { return hospitalId; }
        public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

        public String getOpRegistrationTypeId() { return opRegistrationTypeId; }
        public void setOpRegistrationTypeId(String opRegistrationTypeId) { this.opRegistrationTypeId = opRegistrationTypeId; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }
}
