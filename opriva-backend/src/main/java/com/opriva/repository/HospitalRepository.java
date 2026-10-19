package com.opriva.repository;

import com.opriva.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, String> {
    List<Hospital> findByVerifiedTrue();

    @Query("SELECT h FROM Hospital h WHERE h.verified = true AND (" +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.locality) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "h.postalCode LIKE CONCAT('%', :keyword, '%'))")
    List<Hospital> searchHospitals(@Param("keyword") String keyword);

    List<Hospital> findByCityIgnoreCaseAndVerifiedTrue(String city);
}
