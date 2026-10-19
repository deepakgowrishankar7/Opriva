package com.opriva.repository;

import com.opriva.entity.QueueToken;
import com.opriva.enums.QueueState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTokenRepository extends JpaRepository<QueueToken, String> {
    Optional<QueueToken> findByOpRegistrationId(String opRegistrationId);
    Optional<QueueToken> findByHospitalIdAndTokenNumberAndSessionDate(String hospitalId, String tokenNumber, LocalDate sessionDate);

    List<QueueToken> findByHospitalIdAndSessionDateOrderByPriorityWeightDescTokenSequenceAsc(String hospitalId, LocalDate sessionDate);

    List<QueueToken> findByHospitalIdAndSessionDateAndQueueState(String hospitalId, LocalDate sessionDate, QueueState queueState);

    @Query("SELECT MAX(q.tokenSequence) FROM QueueToken q WHERE q.hospital.id = :hospitalId AND q.sessionDate = :sessionDate AND q.opRegistrationType.typeCode = :typeCode")
    Integer findMaxSequence(@Param("hospitalId") String hospitalId, @Param("sessionDate") LocalDate sessionDate, @Param("typeCode") com.opriva.enums.RegistrationTypeCode typeCode);

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.hospital.id = :hospitalId AND q.sessionDate = :sessionDate AND q.queueState = 'WAITING' AND " +
           "(q.priorityWeight > :priorityWeight OR (q.priorityWeight = :priorityWeight AND q.tokenSequence < :tokenSequence))")
    long countWaitingAhead(@Param("hospitalId") String hospitalId, 
                           @Param("sessionDate") LocalDate sessionDate, 
                           @Param("priorityWeight") int priorityWeight, 
                           @Param("tokenSequence") int tokenSequence);

    @Query("SELECT q FROM QueueToken q WHERE q.hospital.id = :hospitalId AND q.sessionDate = :sessionDate AND q.queueState IN ('CALLED', 'IN_CONSULTATION') ORDER BY q.calledAt DESC")
    List<QueueToken> findCurrentlyActiveTokens(@Param("hospitalId") String hospitalId, @Param("sessionDate") LocalDate sessionDate);
}
