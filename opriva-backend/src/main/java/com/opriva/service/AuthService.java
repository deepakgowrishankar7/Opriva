package com.opriva.service;

import com.opriva.dto.AuthDtos.*;
import com.opriva.entity.PatientProfile;
import com.opriva.entity.User;
import com.opriva.enums.Role;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.repository.PatientProfileRepository;
import com.opriva.repository.UserRepository;
import com.opriva.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(
            UserRepository userRepository,
            PatientProfileRepository patientProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number is already registered");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.ROLE_PATIENT);
        user.setPreferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "en");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // If patient, create patient profile
        if (savedUser.getRole() == Role.ROLE_PATIENT) {
            PatientProfile profile = new PatientProfile();
            profile.setId(UUID.randomUUID().toString());
            profile.setUser(savedUser);
            profile.setCreatedAt(LocalDateTime.now());
            profile.setUpdatedAt(LocalDateTime.now());
            patientProfileRepository.save(profile);
        }

        auditService.logAction(savedUser.getId(), "USER_REGISTERED", "User", savedUser.getId(), "New user account created", null);

        String token = tokenProvider.generateToken(savedUser);
        return new AuthResponse(
                token, savedUser.getId(), savedUser.getEmail(), savedUser.getPhone(),
                savedUser.getFullName(), savedUser.getRole(), savedUser.getPreferredLanguage());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findByPhone(request.getIdentifier()))
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new IllegalStateException("Account is deactivated");
        }

        auditService.logAction(user.getId(), "USER_LOGIN", "User", user.getId(), "User logged in", null);

        String token = tokenProvider.generateToken(user);
        return new AuthResponse(
                token, user.getId(), user.getEmail(), user.getPhone(),
                user.getFullName(), user.getRole(), user.getPreferredLanguage());
    }

    @Transactional
    public void updatePreferredLanguage(String userId, String language) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPreferredLanguage(language);
        userRepository.save(user);
    }
}
