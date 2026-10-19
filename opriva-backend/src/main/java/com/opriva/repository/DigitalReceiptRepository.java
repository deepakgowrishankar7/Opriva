package com.opriva.repository;

import com.opriva.entity.DigitalReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DigitalReceiptRepository extends JpaRepository<DigitalReceipt, String> {
    Optional<DigitalReceipt> findByOpRegistrationId(String opRegistrationId);
    Optional<DigitalReceipt> findByReceiptNumber(String receiptNumber);
}
