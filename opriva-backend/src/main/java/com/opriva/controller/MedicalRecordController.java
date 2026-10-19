package com.opriva.controller;

import com.opriva.dto.MedicalRecordDtos.*;
import com.opriva.entity.User;
import com.opriva.enums.DocumentCategory;
import com.opriva.service.DependentService;
import com.opriva.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final DependentService dependentService;

    public MedicalRecordController(MedicalRecordService medicalRecordService, DependentService dependentService) {
        this.medicalRecordService = medicalRecordService;
        this.dependentService = dependentService;
    }

    @PostMapping(value = "/documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicalDocumentDto> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) DocumentCategory category,
            @RequestParam(value = "documentDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate documentDate,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "dependentId", required = false) String dependentId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(medicalRecordService.uploadDocument(file, category, documentDate, description, dependentId, user));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<MedicalDocumentDto>> getDocuments(
            @RequestParam(value = "patientId", required = false) String patientId,
            @RequestParam(value = "dependentId", required = false) String dependentId,
            @AuthenticationPrincipal User user) {
        String effectivePatientId = (patientId != null && !patientId.isBlank()) ? patientId : user.getId();
        return ResponseEntity.ok(medicalRecordService.getPatientDocuments(effectivePatientId, dependentId, user));
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        byte[] fileBytes = medicalRecordService.retrieveDocumentFile(id, user);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"document_" + id + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }

    @PostMapping("/documents/share")
    public ResponseEntity<?> shareDocument(
            @Valid @RequestBody ShareDocumentRequest request,
            @AuthenticationPrincipal User user) {
        medicalRecordService.shareDocumentWithHospital(request, user);
        return ResponseEntity.ok(Map.of("message", "Document successfully shared with hospital"));
    }

    @GetMapping("/dependents")
    public ResponseEntity<List<DependentDto>> getDependents(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dependentService.getDependents(user.getId()));
    }

    @PostMapping("/dependents")
    public ResponseEntity<DependentDto> createDependent(
            @Valid @RequestBody CreateDependentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dependentService.createDependent(request, user.getId()));
    }
}
