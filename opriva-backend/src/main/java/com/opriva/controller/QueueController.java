package com.opriva.controller;

import com.opriva.dto.QueueDtos.LiveQueueStatusDto;
import com.opriva.service.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/queue")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/live/{registrationId}")
    public ResponseEntity<LiveQueueStatusDto> getLiveQueue(@PathVariable String registrationId) {
        return ResponseEntity.ok(queueService.getPatientLiveQueueStatus(registrationId));
    }
}
