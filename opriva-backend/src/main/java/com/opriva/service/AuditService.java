package com.opriva.service;

import com.opriva.entity.AuditLog;
import com.opriva.entity.User;
import com.opriva.repository.AuditLogRepository;
import com.opriva.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(String userId, String action, String resourceType, String resourceId, String details, String ipAddress) {
        try {
            AuditLog audit = new AuditLog();
            audit.setId(UUID.randomUUID().toString());
            if (userId != null) {
                userRepository.findById(userId).ifPresent(audit::setUser);
            }
            audit.setAction(action);
            audit.setResourceType(resourceType);
            audit.setResourceId(resourceId);
            audit.setDetails(details);
            audit.setIpAddress(ipAddress);
            audit.setCreatedAt(LocalDateTime.now());
            auditLogRepository.save(audit);
        } catch (Exception e) {
            log.warn("Failed to write audit log: {}", e.getMessage());
        }
    }
}
