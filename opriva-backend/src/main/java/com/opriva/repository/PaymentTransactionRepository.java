package com.opriva.repository;

import com.opriva.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, String> {
    Optional<PaymentTransaction> findByProviderPaymentId(String providerPaymentId);
    boolean existsByProviderPaymentId(String providerPaymentId);
}
