package com.opriva;

import com.opriva.dto.QueueDtos.QueueTokenDto;
import com.opriva.dto.QueueDtos.ReceptionistQueueOverviewDto;
import com.opriva.dto.QueueDtos.UpdateQueueStateRequest;
import com.opriva.entity.User;
import com.opriva.enums.QueueState;
import com.opriva.repository.UserRepository;
import com.opriva.service.QueueService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class QueueStateMachineTests {

    @Autowired
    private QueueService queueService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Verify receptionist queue overview and state transition lifecycle")
    public void testQueueStateTransitions() {
        User receptionist = userRepository.findByEmail("receptionist@apollo.opriva.com").orElseThrow();

        // 1. Get overview
        ReceptionistQueueOverviewDto overview = queueService.getReceptionistOverview("hosp-001", LocalDate.now());
        assertNotNull(overview);
        assertTrue(overview.getTotalRegistrations() > 0, "Should have seeded session queue registrations");

        // 2. Call next waiting patient
        QueueTokenDto called = queueService.callNextToken("hosp-001", receptionist);
        assertNotNull(called);
        assertEquals(QueueState.CALLED, called.getQueueState());
        assertNotNull(called.getCalledAt());

        // 3. Transition to IN_CONSULTATION
        QueueTokenDto inConsult = queueService.updateTokenState(
                called.getTokenId(),
                new UpdateQueueStateRequest(QueueState.IN_CONSULTATION, "Patient entered consultation room"),
                receptionist);
        assertEquals(QueueState.IN_CONSULTATION, inConsult.getQueueState());

        // 4. Transition to COMPLETED
        QueueTokenDto completed = queueService.updateTokenState(
                called.getTokenId(),
                new UpdateQueueStateRequest(QueueState.COMPLETED, "Consultation successfully finished"),
                receptionist);
        assertEquals(QueueState.COMPLETED, completed.getQueueState());
    }
}
