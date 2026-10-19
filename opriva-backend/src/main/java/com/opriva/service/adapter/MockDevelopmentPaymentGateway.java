package com.opriva.service.adapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Clearly identified Development Mode Payment Adapter.
 * Used when live Razorpay credentials are not configured in environment.
 */
@Component
@ConditionalOnProperty(name = "opriva.payment.provider", havingValue = "mock", matchIfMissing = true)
public class MockDevelopmentPaymentGateway implements PaymentGatewayAdapter {

    private static final Logger log = LoggerFactory.getLogger(MockDevelopmentPaymentGateway.class);

    @Override
    public String createOrder(BigDecimal amount, String currency, String receiptReference) {
        String orderId = "order_mock_" + UUID.randomUUID().toString().substring(0, 12);
        log.info("[DEVELOPMENT MODE] Created mock payment order: {} for amount: {} {}", orderId, amount, currency);
        return orderId;
    }

    @Override
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        log.info("[DEVELOPMENT MODE] Verifying mock payment for order: {}, payment: {}", orderId, paymentId);
        // Validates that paymentId is provided and non-empty
        return paymentId != null && !paymentId.isBlank();
    }

    @Override
    public String getProviderName() {
        return "MOCK_DEV_PAYMENT_GATEWAY";
    }
}
