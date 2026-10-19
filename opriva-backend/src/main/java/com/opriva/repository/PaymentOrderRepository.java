package com.opriva.repository;

import com.opriva.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, String> {
    Optional<PaymentOrder> findByProviderOrderId(String providerOrderId);
    Optional<PaymentOrder> findBySlotReservationId(String slotReservationId);
    Optional<PaymentOrder> findByIdempotencyKey(String idempotencyKey);
}
