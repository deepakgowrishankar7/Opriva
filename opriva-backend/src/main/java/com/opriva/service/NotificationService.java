package com.opriva.service;

import com.opriva.dto.MedicalRecordDtos.NotificationDto;
import com.opriva.entity.Notification;
import com.opriva.entity.User;
import com.opriva.repository.NotificationRepository;
import com.opriva.repository.UserRepository;
import com.opriva.websocket.QueueWebSocketPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final QueueWebSocketPublisher webSocketPublisher;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            QueueWebSocketPublisher webSocketPublisher) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.webSocketPublisher = webSocketPublisher;
    }

    @Transactional
    public void createNotification(String userId, String title, String message, String type) {
        userRepository.findById(userId).ifPresent(user -> {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setUser(user);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setNotificationType(type);
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            Notification saved = notificationRepository.save(notification);

            // Push to patient personal WebSocket channel
            webSocketPublisher.sendPatientPersonalUpdate(userId, mapToDto(saved));
        });
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(String notificationId, String userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUser().getId().equals(userId)) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    private NotificationDto mapToDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setNotificationType(n.getNotificationType());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
