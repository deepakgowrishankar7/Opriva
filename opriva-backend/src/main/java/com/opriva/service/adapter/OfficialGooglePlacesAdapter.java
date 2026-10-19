package com.opriva.service.adapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Official Google Places API Adapter.
 * Calls Google Places Place Details API requesting rating, user_ratings_total, formatted_address, url.
 */
@Component
@ConditionalOnProperty(name = "opriva.places.provider", havingValue = "google")
public class OfficialGooglePlacesAdapter implements GooglePlacesAdapter {

    private static final Logger log = LoggerFactory.getLogger(OfficialGooglePlacesAdapter.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${opriva.places.google-api-key:}")
    private String apiKey;

    @Override
    public GooglePlaceRatingDetails getPlaceRating(String googlePlaceId) {
        if (apiKey == null || apiKey.isBlank() || googlePlaceId == null || googlePlaceId.isBlank()) {
            log.warn("Google Places API key or place ID not provided. Returning null.");
            return null;
        }

        try {
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=rating,user_ratings_total,formatted_address,url&key=%s",
                    googlePlaceId, apiKey);

            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && "OK".equals(response.get("status"))) {
                Map result = (Map) response.get("result");
                Double rating = result.get("rating") != null ? Double.valueOf(result.get("rating").toString()) : null;
                Integer reviewCount = result.get("user_ratings_total") != null ? Integer.valueOf(result.get("user_ratings_total").toString()) : null;
                String address = (String) result.get("formatted_address");
                String placeUrl = (String) result.get("url");

                GooglePlaceRatingDetails details = new GooglePlaceRatingDetails(rating, reviewCount, address, placeUrl);
                details.setAttribution("Google Places Verified");
                return details;
            } else {
                log.warn("Google Places API returned status: {}", response != null ? response.get("status") : "null");
                return null;
            }
        } catch (Exception e) {
            log.error("Error calling Google Places API", e);
            return null;
        }
    }

    @Override
    public String getProviderName() {
        return "OFFICIAL_GOOGLE_PLACES_API";
    }
}
