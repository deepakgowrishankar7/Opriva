package com.opriva.service.adapter;

public interface GooglePlacesAdapter {
    GooglePlaceRatingDetails getPlaceRating(String googlePlaceId);
    String getProviderName();

    class GooglePlaceRatingDetails {
        private Double rating;
        private Integer userRatingsTotal;
        private String formattedAddress;
        private String placeUrl;
        private String attribution = "Official Google Places Verified";

        public GooglePlaceRatingDetails() {}
        public GooglePlaceRatingDetails(Double rating, Integer userRatingsTotal, String formattedAddress, String placeUrl) {
            this.rating = rating;
            this.userRatingsTotal = userRatingsTotal;
            this.formattedAddress = formattedAddress;
            this.placeUrl = placeUrl;
        }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public Integer getUserRatingsTotal() { return userRatingsTotal; }
        public void setUserRatingsTotal(Integer userRatingsTotal) { this.userRatingsTotal = userRatingsTotal; }

        public String getFormattedAddress() { return formattedAddress; }
        public void setFormattedAddress(String formattedAddress) { this.formattedAddress = formattedAddress; }

        public String getPlaceUrl() { return placeUrl; }
        public void setPlaceUrl(String placeUrl) { this.placeUrl = placeUrl; }

        public String getAttribution() { return attribution; }
        public void setAttribution(String attribution) { this.attribution = attribution; }
    }
}
