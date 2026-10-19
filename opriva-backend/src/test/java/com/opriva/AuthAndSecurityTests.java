package com.opriva;

import com.opriva.dto.AuthDtos.AuthResponse;
import com.opriva.dto.AuthDtos.LoginRequest;
import com.opriva.dto.AuthDtos.RegisterRequest;
import com.opriva.enums.Role;
import com.opriva.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class AuthAndSecurityTests {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Should successfully register a new patient user and return JWT token")
    public void testUserRegistration() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Kavita Nair");
        request.setEmail("kavita.nair@test.com");
        request.setPhone("9811223344");
        request.setPassword("SecretPass123");
        request.setRole(Role.ROLE_PATIENT);
        request.setPreferredLanguage("te"); // Telugu

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("kavita.nair@test.com", response.getEmail());
        assertEquals("9811223344", response.getPhone());
        assertEquals("te", response.getPreferredLanguage());
        assertEquals(Role.ROLE_PATIENT, response.getRole());
    }

    @Test
    @DisplayName("Should login successfully with valid credentials and fail with invalid password")
    public void testUserLogin() {
        // Register user
        RegisterRequest register = new RegisterRequest();
        register.setFullName("Suresh Kumar");
        register.setEmail("suresh.kumar@test.com");
        register.setPhone("9822334455");
        register.setPassword("CorrectPassword123");
        authService.register(register);

        // Valid login
        LoginRequest validLogin = new LoginRequest("suresh.kumar@test.com", "CorrectPassword123");
        AuthResponse loginResponse = authService.login(validLogin);
        assertNotNull(loginResponse.getToken());

        // Invalid password login rejection
        LoginRequest invalidLogin = new LoginRequest("suresh.kumar@test.com", "WrongPassword");
        assertThrows(IllegalArgumentException.class, () -> authService.login(invalidLogin));
    }
}
