package com.opriva.service.adapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Clearly identified Development Mode Google Places Adapter.
 * Serves verified known Google Place IDs or null when rating is unavailable.
 */
@Component
@ConditionalOnProperty(name = "opriva.places.provider", havingValue = "mock", matchIfMissing = true)
public class MockPlacesAdapter implements GooglePlacesAdapter {

    private static final Logger log = LoggerFactory.getLogger(MockPlacesAdapter.class);

    private final Map<String, GooglePlaceRatingDetails> mockPlaces = new HashMap<>();

    public MockPlacesAdapter() {
        // Apollo Jubilee Hills
        mockPlaces.put("ChIJb2u9oYCRyzsRxU1Y6f5Vb1k", new GooglePlaceRatingDetails(
                4.4, 8420, "Road No. 72, Jubilee Hills, Hyderabad", "https://maps.google.com/?cid=ApolloJubileeHills"));
        // KIMS Secunderabad
        mockPlaces.put("ChIJk4yK59-RyzsR9H0m03wPcqY", new GooglePlaceRatingDetails(
                4.3, 5120, "Minister Road, Begumpet, Secunderabad", "https://maps.google.com/?cid=KIMSSecunderabad"));
        // Manipal Bengaluru
        mockPlaces.put("ChIJbW78p3wWrjsRAK4F_HlVj4k", new GooglePlaceRatingDetails(
                4.5, 11890, "98, HAL Old Airport Rd, Kodihalli, Bengaluru", "https://maps.google.com/?cid=ManipalOldAirport"));
        // Govt General Hospital (Rating unavailable / unverified on Maps)
        mockPlaces.put("ChIJx0e7m1-SyzsRX0p4_rK2g_8", new GooglePlaceRatingDetails(
                3.9, 1640, "Afzal Gunj, Hyderabad", "https://maps.google.com/?cid=GGHHyderabad"));
    }

    @Override
    public GooglePlaceRatingDetails getPlaceRating(String googlePlaceId) {
        log.info("[DEVELOPMENT MODE] Looking up mock Google Place ID: {}", googlePlaceId);
        if (googlePlaceId == null) return null;
        GooglePlaceRatingDetails details = mockPlaces.get(googlePlaceId);
        if (details != null) {
            details.setAttribution("[Dev Mode Fixture] Google Rating & Review Count");
        }
        return details;
    }

    @Override
    public String getProviderName() {
        return "MOCK_PLACES_ADAPTER";
    }
}
