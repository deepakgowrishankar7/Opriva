package com.opriva.service;

import com.opriva.dto.HospitalDtos.*;
import com.opriva.entity.Hospital;
import com.opriva.entity.OpRegistrationType;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.repository.HospitalRepository;
import com.opriva.repository.OpRegistrationTypeRepository;
import com.opriva.service.adapter.GooglePlacesAdapter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final OpRegistrationTypeRepository opRegistrationTypeRepository;
    private final GooglePlacesAdapter googlePlacesAdapter;

    public HospitalService(
            HospitalRepository hospitalRepository,
            OpRegistrationTypeRepository opRegistrationTypeRepository,
            GooglePlacesAdapter googlePlacesAdapter) {
        this.hospitalRepository = hospitalRepository;
        this.opRegistrationTypeRepository = opRegistrationTypeRepository;
        this.googlePlacesAdapter = googlePlacesAdapter;
    }

    @Transactional(readOnly = true)
    public List<HospitalSummaryDto> getHospitals(String keyword, String city, Double userLat, Double userLon) {
        List<Hospital> hospitals;
        if (keyword != null && !keyword.isBlank()) {
            hospitals = hospitalRepository.searchHospitals(keyword.trim());
        } else if (city != null && !city.isBlank()) {
            hospitals = hospitalRepository.findByCityIgnoreCaseAndVerifiedTrue(city.trim());
        } else {
            hospitals = hospitalRepository.findByVerifiedTrue();
        }

        List<HospitalSummaryDto> results = hospitals.stream()
                .map(h -> mapToSummaryDto(h, userLat, userLon))
                .collect(Collectors.toList());

        // Sort by distance if coordinates provided
        if (userLat != null && userLon != null) {
            results.sort(Comparator.comparing(
                    h -> h.getDistanceKm() != null ? h.getDistanceKm() : Double.MAX_VALUE));
        }

        return results;
    }

    @Transactional(readOnly = true)
    public HospitalDetailDto getHospitalDetails(String hospitalId, Double userLat, Double userLon) {
        Hospital h = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found: " + hospitalId));

        HospitalDetailDto dto = new HospitalDetailDto();
        populateSummaryFields(dto, h, userLat, userLon);

        dto.setProviderIdentifier(h.getProviderIdentifier() != null ? h.getProviderIdentifier() : "Not provided");
        dto.setEmergencyPhone(h.getEmergencyPhone());
        dto.setEmail(h.getEmail());
        dto.setVerificationDate(h.getVerificationDate());
        dto.setVerifiedBy(h.getVerifiedBy());

        return dto;
    }

    private HospitalSummaryDto mapToSummaryDto(Hospital h, Double userLat, Double userLon) {
        HospitalSummaryDto dto = new HospitalSummaryDto();
        populateSummaryFields(dto, h, userLat, userLon);
        return dto;
    }

    private void populateSummaryFields(HospitalSummaryDto dto, Hospital h, Double userLat, Double userLon) {
        dto.setId(h.getId());
        dto.setName(h.getName());
        dto.setAddress(h.getAddress());
        dto.setLocality(h.getLocality());
        dto.setCity(h.getCity());
        dto.setState(h.getState());
        dto.setPostalCode(h.getPostalCode());
        dto.setLatitude(h.getLatitude());
        dto.setLongitude(h.getLongitude());
        dto.setReceptionistPhone(h.getReceptionistPhone() != null ? h.getReceptionistPhone() : "Not provided");
        dto.setGooglePlaceId(h.getGooglePlaceId());
        dto.setVerified(h.isVerified());

        // Clearly distinguish official registration number
        dto.setOfficialRegistrationNumber(
                h.getOfficialRegistrationNumber() != null ? h.getOfficialRegistrationNumber() : "Not provided");

        // Calculate distance if coordinates provided
        if (userLat != null && userLon != null && h.getLatitude() != null && h.getLongitude() != null) {
            dto.setDistanceKm(calculateDistanceKm(userLat, userLon, h.getLatitude(), h.getLongitude()));
        }

        // Live Google rating lookup via adapter
        if (h.getGooglePlaceId() != null) {
            GooglePlacesAdapter.GooglePlaceRatingDetails placeDetails = googlePlacesAdapter.getPlaceRating(h.getGooglePlaceId());
            if (placeDetails != null && placeDetails.getRating() != null) {
                dto.setGoogleRating(placeDetails.getRating());
                dto.setGoogleReviewCount(placeDetails.getUserRatingsTotal());
                dto.setRatingAttribution(placeDetails.getAttribution());
            } else {
                dto.setGoogleRating(h.getGoogleRating());
                dto.setGoogleReviewCount(h.getGoogleReviewCount());
                dto.setRatingAttribution("Hospital Stored Google Rating");
            }
        } else {
            dto.setGoogleRating(null);
            dto.setGoogleReviewCount(null);
            dto.setRatingAttribution("Rating not available");
        }

        // Available OP card types
        List<OpRegistrationType> types = opRegistrationTypeRepository.findByHospitalIdAndActiveTrue(h.getId());
        List<OpRegistrationTypeDto> typeDtos = types.stream().map(t -> {
            OpRegistrationTypeDto td = new OpRegistrationTypeDto();
            td.setId(t.getId());
            td.setTypeCode(t.getTypeCode());
            td.setDisplayName(t.getDisplayName());
            td.setFeeAmount(t.getFeeAmount());
            td.setCurrency(t.getCurrency());
            td.setPriorityLevel(t.getPriorityLevel());
            td.setDescription(t.getDescription());
            return td;
        }).collect(Collectors.toList());
        dto.setAvailableRegistrationTypes(typeDtos);
    }

    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c;
        return Math.round(distance * 10.0) / 10.0;
    }
}
