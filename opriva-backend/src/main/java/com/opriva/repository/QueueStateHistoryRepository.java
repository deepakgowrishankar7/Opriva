package com.opriva.repository;

import com.opriva.entity.QueueStateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueueStateHistoryRepository extends JpaRepository<QueueStateHistory, String> {
    List<QueueStateHistory> findByQueueTokenIdOrderByChangedAtAsc(String queueTokenId);
}
