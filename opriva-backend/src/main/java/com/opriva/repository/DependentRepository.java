package com.opriva.repository;

import com.opriva.entity.Dependent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DependentRepository extends JpaRepository<Dependent, String> {
    List<Dependent> findByPrimaryPatientId(String primaryPatientId);
}
