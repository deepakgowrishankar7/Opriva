package com.opriva.entity;

import com.opriva.enums.QueueState;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_state_history")
public class QueueStateHistory {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_token_id", nullable = false)
    private QueueToken queueToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_state", length = 30)
    private QueueState fromState;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_state", nullable = false, length = 30)
    private QueueState toState;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_user_id")
    private User changedByUser;

    @Column(length = 255)
    private String reason;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    public QueueStateHistory() {}

    @PrePersist
    protected void onCreate() {
        if (changedAt == null) changedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public QueueToken getQueueToken() { return queueToken; }
    public void setQueueToken(QueueToken queueToken) { this.queueToken = queueToken; }

    public QueueState getFromState() { return fromState; }
    public void setFromState(QueueState fromState) { this.fromState = fromState; }

    public QueueState getToState() { return toState; }
    public void setToState(QueueState toState) { this.toState = toState; }

    public User getChangedByUser() { return changedByUser; }
    public void setChangedByUser(User changedByUser) { this.changedByUser = changedByUser; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
