package com.opriva.controller;

import com.opriva.dto.AuthDtos.*;
import com.opriva.entity.User;
import com.opriva.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail() != null ? user.getEmail() : "",
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole(),
                "preferredLanguage", user.getPreferredLanguage()
        ));
    }

    @PutMapping("/language")
    public ResponseEntity<?> updateLanguage(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        String lang = body.get("language");
        if (lang != null && user != null) {
            authService.updatePreferredLanguage(user.getId(), lang);
        }
        return ResponseEntity.ok(Map.of("message", "Language updated successfully", "language", lang));
    }
}
