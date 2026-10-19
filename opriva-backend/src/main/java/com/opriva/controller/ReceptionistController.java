package com.opriva.controller;

import com.opriva.dto.QueueDtos.QueueTokenDto;
import com.opriva.dto.QueueDtos.ReceptionistQueueOverviewDto;
import com.opriva.dto.QueueDtos.UpdateQueueStateRequest;
import com.opriva.dto.RegistrationDtos.RegistrationConfirmationDto;
import com.opriva.dto.RegistrationDtos.WalkInRegistrationRequest;
import com.opriva.entity.User;
import com.opriva.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/receptionist")
@PreAuthorize("hasAnyAuthority('ROLE_RECEPTIONIST', 'ROLE_SUPPORT')")
public class ReceptionistController {

    private final QueueService queueService;

    public ReceptionistController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/queue/{hospitalId}")
    public ResponseEntity<ReceptionistQueueOverviewDto> getQueueOverview(
            @PathVariable String hospitalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(queueService.getReceptionistOverview(hospitalId, date));
    }

    @PostMapping("/call-next/{hospitalId}")
    public ResponseEntity<QueueTokenDto> callNext(
            @PathVariable String hospitalId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(queueService.callNextToken(hospitalId, user));
    }

    @PostMapping("/tokens/{tokenId}/state")
    public ResponseEntity<QueueTokenDto> updateTokenState(
            @PathVariable String tokenId,
            @Valid @RequestBody UpdateQueueStateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(queueService.updateTokenState(tokenId, request, user));
    }

    @PostMapping("/walk-in")
    public ResponseEntity<RegistrationConfirmationDto> registerWalkIn(
            @Valid @RequestBody WalkInRegistrationRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(queueService.registerWalkIn(request, user));
    }
}
