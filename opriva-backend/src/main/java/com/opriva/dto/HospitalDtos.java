package com.opriva.dto;

import com.opriva.enums.RegistrationTypeCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class HospitalDtos {

    public static class OpRegistrationTypeDto {
        private String id;
        private RegistrationTypeCode typeCode;
        private String displayName;
        private BigDecimal feeAmount;
        private String currency;
        private int priorityLevel;
        private String description;

        public OpRegistrationTypeDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public RegistrationTypeCode getTypeCode() { return typeCode; }
        public void setTypeCode(RegistrationTypeCode typeCode) { this.typeCode = typeCode; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }

        public BigDecimal getFeeAmount() { return feeAmount; }
        public void setFeeAmount(BigDecimal feeAmount) { this.feeAmount = feeAmount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public int getPriorityLevel() { return priorityLevel; }
        public void setPriorityLevel(int priorityLevel) { this.priorityLevel = priorityLevel; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class HospitalSummaryDto {
        private String id;
        private String name;
        private String address;
        private String locality;
        private String city;
        private String state;
        private String postalCode;
        private Double latitude;
        private Double longitude;
        private Double distanceKm;
        private String receptionistPhone;
        private String googlePlaceId;
        private Double googleRating;
        private Integer googleReviewCount;
        private String ratingAttribution = "Verified Google Rating & Reviews";
        private boolean verified;
        private String officialRegistrationNumber; // Clearly distinguished, or "Not provided"
        private List<OpRegistrationTypeDto> availableRegistrationTypes;

        public HospitalSummaryDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getLocality() { return locality; }
        public void setLocality(String locality) { this.locality = locality; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }

        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }

        public Double getDistanceKm() { return distanceKm; }
        public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

        public String getReceptionistPhone() { return receptionistPhone; }
        public void setReceptionistPhone(String receptionistPhone) { this.receptionistPhone = receptionistPhone; }

        public String getGooglePlaceId() { return googlePlaceId; }
        public void setGooglePlaceId(String googlePlaceId) { this.googlePlaceId = googlePlaceId; }

        public Double getGoogleRating() { return googleRating; }
        public void setGoogleRating(Double googleRating) { this.googleRating = googleRating; }

        public Integer getGoogleReviewCount() { return googleReviewCount; }
        public void setGoogleReviewCount(Integer googleReviewCount) { this.googleReviewCount = googleReviewCount; }

        public String getRatingAttribution() { return ratingAttribution; }
        public void setRatingAttribution(String ratingAttribution) { this.ratingAttribution = ratingAttribution; }

        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }

        public String getOfficialRegistrationNumber() { return officialRegistrationNumber; }
        public void setOfficialRegistrationNumber(String officialRegistrationNumber) { this.officialRegistrationNumber = officialRegistrationNumber; }

        public List<OpRegistrationTypeDto> getAvailableRegistrationTypes() { return availableRegistrationTypes; }
        public void setAvailableRegistrationTypes(List<OpRegistrationTypeDto> availableRegistrationTypes) { this.availableRegistrationTypes = availableRegistrationTypes; }
    }

    public static class HospitalDetailDto extends HospitalSummaryDto {
        private String providerIdentifier;
        private String emergencyPhone;
        private String email;
        private LocalDateTime verificationDate;
        private String verifiedBy;

        public HospitalDetailDto() {}

        public String getProviderIdentifier() { return providerIdentifier; }
        public void setProviderIdentifier(String providerIdentifier) { this.providerIdentifier = providerIdentifier; }

        public String getEmergencyPhone() { return emergencyPhone; }
        public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public LocalDateTime getVerificationDate() { return verificationDate; }
        public void setVerificationDate(LocalDateTime verificationDate) { this.verificationDate = verificationDate; }

        public String getVerifiedBy() { return verifiedBy; }
        public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }
    }
}
