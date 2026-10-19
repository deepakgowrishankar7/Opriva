package com.opriva;

import com.opriva.dto.RegistrationDtos.*;
import com.opriva.entity.PaymentOrder;
import com.opriva.entity.User;
import com.opriva.enums.QueueState;
import com.opriva.enums.Role;
import com.opriva.repository.UserRepository;
import com.opriva.service.PaymentService;
import com.opriva.service.ReservationService;
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
public class PaymentAndRegistrationTests {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Complete end-to-end booking: reservation -> payment order -> server verification -> confirmed token & receipt")
    public void testCompleteBookingAndVerificationFlow() {
        User patient = userRepository.findByEmail("patient@opriva.com").orElseThrow();

        // 1. Create slot reservation
        CreateReservationRequest reservationReq = new CreateReservationRequest();
        reservationReq.setHospitalId("hosp-001"); // Apollo Jubilee Hills
        reservationReq.setOpRegistrationTypeId("type-001"); // Normal OP Card
        reservationReq.setSessionDate(LocalDate.now());
        reservationReq.setSlotTime("10:00 - 11:00 AM");

        ReservationResponse res = reservationService.createReservation(reservationReq, patient.getId());
        assertNotNull(res);
        assertNotNull(res.getReservationId());
        assertEquals("Apollo Health City", res.getHospitalName());
        assertEquals("RESERVED", res.getStatus());

        // 2. Create Payment Order
        PaymentOrder order = paymentService.createPaymentOrder(res.getReservationId(), patient.getId());
        assertNotNull(order);
        assertNotNull(order.getProviderOrderId());

        // 3. Verify Payment and Confirm Registration
        VerifyPaymentRequest verifyReq = new VerifyPaymentRequest();
        verifyReq.setReservationId(res.getReservationId());
        verifyReq.setProviderOrderId(order.getProviderOrderId());
        verifyReq.setProviderPaymentId("pay_test_" + System.currentTimeMillis());
        verifyReq.setProviderSignature("mock_valid_signature");

        RegistrationConfirmationDto confirmation = paymentService.verifyPaymentAndConfirmRegistration(verifyReq, patient.getId());

        assertNotNull(confirmation);
        assertNotNull(confirmation.getOpRegistrationNumber(), "Must have unique OP registration number");
        assertTrue(confirmation.getOpRegistrationNumber().startsWith("OPR-"));
        assertNotNull(confirmation.getTokenNumber(), "Must have queue token");
        assertTrue(confirmation.getTokenNumber().startsWith("N-"), "Normal card token must start with N-");
        assertEquals(QueueState.WAITING, confirmation.getQueueState());
        assertNotNull(confirmation.getDigitalReceiptNumber(), "Must issue digital receipt");
        assertTrue(confirmation.getDigitalReceiptNumber().startsWith("RCP-"));
    }
}
