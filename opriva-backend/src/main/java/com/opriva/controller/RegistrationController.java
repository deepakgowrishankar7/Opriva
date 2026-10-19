package com.opriva.controller;

import com.opriva.dto.RegistrationDtos.*;
import com.opriva.entity.DigitalReceipt;
import com.opriva.entity.OpRegistration;
import com.opriva.entity.PaymentOrder;
import com.opriva.entity.User;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.exception.UnauthorizedException;
import com.opriva.repository.DigitalReceiptRepository;
import com.opriva.repository.OpRegistrationRepository;
import com.opriva.service.PaymentService;
import com.opriva.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class RegistrationController {

    private final ReservationService reservationService;
    private final PaymentService paymentService;
    private final OpRegistrationRepository opRegistrationRepository;
    private final DigitalReceiptRepository digitalReceiptRepository;

    public RegistrationController(
            ReservationService reservationService,
            PaymentService paymentService,
            OpRegistrationRepository opRegistrationRepository,
            DigitalReceiptRepository digitalReceiptRepository) {
        this.reservationService = reservationService;
        this.paymentService = paymentService;
        this.opRegistrationRepository = opRegistrationRepository;
        this.digitalReceiptRepository = digitalReceiptRepository;
    }

    @PostMapping("/reservations")
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reservationService.createReservation(request, user.getId()));
    }

    @PostMapping("/payments/create-order")
    public ResponseEntity<Map<String, Object>> createPaymentOrder(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        String reservationId = body.get("reservationId");
        PaymentOrder order = paymentService.createPaymentOrder(reservationId, user.getId());
        return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "providerOrderId", order.getProviderOrderId(),
                "amount", order.getAmount(),
                "currency", order.getCurrency(),
                "status", order.getStatus()
        ));
    }

    @PostMapping("/payments/verify")
    public ResponseEntity<RegistrationConfirmationDto> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(paymentService.verifyPaymentAndConfirmRegistration(request, user.getId()));
    }

    @GetMapping("/registrations/my")
    public ResponseEntity<List<Map<String, Object>>> getMyRegistrations(@AuthenticationPrincipal User user) {
        List<OpRegistration> registrations = opRegistrationRepository.findByPatientIdOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> list = registrations.stream().map(r -> Map.<String, Object>of(
                "registrationId", r.getId(),
                "opRegistrationNumber", r.getOpRegistrationNumber(),
                "hospitalName", r.getHospital().getName(),
                "patientName", r.getDependent() != null ? r.getDependent().getFullName() : r.getPatient().getFullName(),
                "registrationType", r.getOpRegistrationType().getDisplayName(),
                "sessionDate", r.getSessionDate(),
                "feePaid", r.getFeePaid(),
                "currency", r.getCurrency(),
                "status", r.getStatus()
        )).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/registrations/{id}/receipt")
    public ResponseEntity<DigitalReceiptDto> getReceipt(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        OpRegistration reg = opRegistrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found: " + id));

        if (!reg.getPatient().getId().equals(user.getId()) && !user.getRole().name().equals("ROLE_RECEPTIONIST")) {
            throw new UnauthorizedException("Unauthorized to view receipt");
        }

        DigitalReceipt receipt = digitalReceiptRepository.findByOpRegistrationId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found for registration: " + id));

        DigitalReceiptDto dto = new DigitalReceiptDto();
        dto.setReceiptNumber(receipt.getReceiptNumber());
        dto.setOpRegistrationNumber(reg.getOpRegistrationNumber());
        dto.setTokenNumber(receipt.getTokenNumber());
        dto.setHospitalName(receipt.getHospitalName());
        dto.setPatientName(receipt.getPatientName());
        dto.setRegistrationTypeName(receipt.getRegistrationTypeName());
        dto.setFeePaid(receipt.getFeePaid());
        dto.setCurrency(receipt.getCurrency());
        dto.setPaymentReference(receipt.getPaymentReference());
        dto.setIssuedAt(receipt.getIssuedAt());

        return ResponseEntity.ok(dto);
    }
}
