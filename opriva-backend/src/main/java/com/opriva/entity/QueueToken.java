package com.opriva.entity;

import com.opriva.enums.QueueState;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tokens")
public class QueueToken {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "op_registration_id", nullable = false, unique = true)
    private OpRegistration opRegistration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "op_registration_type_id", nullable = false)
    private OpRegistrationType opRegistrationType;

    @Column(name = "token_number", nullable = false, length = 30)
    private String tokenNumber;

    @Column(name = "token_sequence", nullable = false)
    private int tokenSequence;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "queue_state", nullable = false, length = 30)
    private QueueState queueState = QueueState.WAITING;

    @Column(name = "priority_weight", nullable = false)
    private int priorityWeight = 1;

    @Column(name = "called_at")
    private LocalDateTime calledAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public QueueToken() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public OpRegistration getOpRegistration() { return opRegistration; }
    public void setOpRegistration(OpRegistration opRegistration) { this.opRegistration = opRegistration; }

    public OpRegistrationType getOpRegistrationType() { return opRegistrationType; }
    public void setOpRegistrationType(OpRegistrationType opRegistrationType) { this.opRegistrationType = opRegistrationType; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public int getTokenSequence() { return tokenSequence; }
    public void setTokenSequence(int tokenSequence) { this.tokenSequence = tokenSequence; }

    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

    public QueueState getQueueState() { return queueState; }
    public void setQueueState(QueueState queueState) { this.queueState = queueState; }

    public int getPriorityWeight() { return priorityWeight; }
    public void setPriorityWeight(int priorityWeight) { this.priorityWeight = priorityWeight; }

    public LocalDateTime getCalledAt() { return calledAt; }
    public void setCalledAt(LocalDateTime calledAt) { this.calledAt = calledAt; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
