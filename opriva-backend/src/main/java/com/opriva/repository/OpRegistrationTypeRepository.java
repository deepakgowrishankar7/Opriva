package com.opriva.repository;

import com.opriva.entity.OpRegistrationType;
import com.opriva.enums.RegistrationTypeCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OpRegistrationTypeRepository extends JpaRepository<OpRegistrationType, String> {
    List<OpRegistrationType> findByHospitalIdAndActiveTrue(String hospitalId);
    Optional<OpRegistrationType> findByHospitalIdAndTypeCodeAndActiveTrue(String hospitalId, RegistrationTypeCode typeCode);
}
