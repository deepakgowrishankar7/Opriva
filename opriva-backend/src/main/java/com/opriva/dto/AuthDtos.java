package com.opriva.dto;

import com.opriva.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public static class LoginRequest {
        @NotBlank(message = "Username/Email/Phone is required")
        private String identifier;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String identifier, String password) {
            this.identifier = identifier;
            this.password = password;
        }

        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Phone number is required")
        private String phone;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotBlank(message = "Full name is required")
        private String fullName;

        private Role role = Role.ROLE_PATIENT;
        private String preferredLanguage = "en";

        public RegisterRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    }

    public static class AuthResponse {
        private String token;
        private String userId;
        private String email;
        private String phone;
        private String fullName;
        private Role role;
        private String preferredLanguage;

        public AuthResponse() {}

        public AuthResponse(String token, String userId, String email, String phone, String fullName, Role role, String preferredLanguage) {
            this.token = token;
            this.userId = userId;
            this.email = email;
            this.phone = phone;
            this.fullName = fullName;
            this.role = role;
            this.preferredLanguage = preferredLanguage;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    }
}
