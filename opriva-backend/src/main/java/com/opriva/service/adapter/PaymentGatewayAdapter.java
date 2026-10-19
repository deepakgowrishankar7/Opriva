package com.opriva.service.adapter;

import java.math.BigDecimal;

public interface PaymentGatewayAdapter {
    String createOrder(BigDecimal amount, String currency, String receiptReference);
    boolean verifySignature(String orderId, String paymentId, String signature);
    String getProviderName();
}
