package com.opriva.controller;

import com.opriva.dto.MedicalRecordDtos.*;
import com.opriva.entity.User;
import com.opriva.service.ClinicalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clinical")
public class ClinicalController {

    private final ClinicalService clinicalService;

    public ClinicalController(ClinicalService clinicalService) {
        this.clinicalService = clinicalService;
    }

    @GetMapping("/visits")
    public ResponseEntity<List<VisitRecordDto>> getVisitTimeline(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String dependentId,
            @AuthenticationPrincipal User user) {
        String effectivePatientId = (patientId != null && !patientId.isBlank()) ? patientId : user.getId();
        return ResponseEntity.ok(clinicalService.getPatientVisitTimeline(effectivePatientId, dependentId, user));
    }

    @PostMapping("/prescriptions")
    @PreAuthorize("hasAnyAuthority('ROLE_CLINICIAN', 'ROLE_SUPPORT')")
    public ResponseEntity<PrescriptionDto> createPrescription(
            @Valid @RequestBody CreatePrescriptionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(clinicalService.createPrescription(request, user));
    }
}
