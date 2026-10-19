package com.opriva.controller;

import com.opriva.dto.HospitalDtos.HospitalDetailDto;
import com.opriva.dto.HospitalDtos.HospitalSummaryDto;
import com.opriva.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<HospitalSummaryDto>> searchHospitals(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        return ResponseEntity.ok(hospitalService.getHospitals(keyword, city, lat, lon));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalDetailDto> getHospitalById(
            @PathVariable String id,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        return ResponseEntity.ok(hospitalService.getHospitalDetails(id, lat, lon));
    }
}
