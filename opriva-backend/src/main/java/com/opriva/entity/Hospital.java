package com.opriva.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
public class Hospital {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "official_registration_number", length = 100)
    private String officialRegistrationNumber;

    @Column(name = "provider_identifier", length = 100)
    private String providerIdentifier;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String locality;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    private Double latitude;
    private Double longitude;

    @Column(name = "receptionist_phone", length = 25)
    private String receptionistPhone;

    @Column(name = "emergency_phone", length = 25)
    private String emergencyPhone;

    @Column(length = 150)
    private String email;

    @Column(name = "google_place_id", length = 100)
    private String googlePlaceId;

    @Column(name = "google_rating")
    private Double googleRating;

    @Column(name = "google_review_count")
    private Integer googleReviewCount;

    @Column(name = "is_verified", nullable = false)
    private boolean verified = false;

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    @Column(name = "verified_by", length = 150)
    private String verifiedBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Hospital() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOfficialRegistrationNumber() { return officialRegistrationNumber; }
    public void setOfficialRegistrationNumber(String officialRegistrationNumber) { this.officialRegistrationNumber = officialRegistrationNumber; }

    public String getProviderIdentifier() { return providerIdentifier; }
    public void setProviderIdentifier(String providerIdentifier) { this.providerIdentifier = providerIdentifier; }

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

    public String getReceptionistPhone() { return receptionistPhone; }
    public void setReceptionistPhone(String receptionistPhone) { this.receptionistPhone = receptionistPhone; }

    public String getEmergencyPhone() { return emergencyPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGooglePlaceId() { return googlePlaceId; }
    public void setGooglePlaceId(String googlePlaceId) { this.googlePlaceId = googlePlaceId; }

    public Double getGoogleRating() { return googleRating; }
    public void setGoogleRating(Double googleRating) { this.googleRating = googleRating; }

    public Integer getGoogleReviewCount() { return googleReviewCount; }
    public void setGoogleReviewCount(Integer googleReviewCount) { this.googleReviewCount = googleReviewCount; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public LocalDateTime getVerificationDate() { return verificationDate; }
    public void setVerificationDate(LocalDateTime verificationDate) { this.verificationDate = verificationDate; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
