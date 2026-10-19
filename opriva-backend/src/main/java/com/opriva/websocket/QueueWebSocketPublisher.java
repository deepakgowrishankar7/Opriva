package com.opriva.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class QueueWebSocketPublisher {

    private static final Logger log = LoggerFactory.getLogger(QueueWebSocketPublisher.class);
    private final SimpMessagingTemplate messagingTemplate;

    public QueueWebSocketPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastHospitalQueue(String hospitalId, Object queueUpdate) {
        String destination = "/topic/hospitals/" + hospitalId + "/queue";
        log.info("Broadcasting live queue update to {}", destination);
        messagingTemplate.convertAndSend(destination, queueUpdate);
    }

    public void sendPatientPersonalUpdate(String userId, Object update) {
        String destination = "/topic/patients/" + userId + "/notifications";
        log.info("Sending personal real-time notification to {}", destination);
        messagingTemplate.convertAndSend(destination, update);
    }
}
