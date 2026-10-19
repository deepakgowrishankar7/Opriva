package com.opriva.dto;

import com.opriva.enums.QueueState;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class QueueDtos {

    public static class QueueTokenDto {
        private String tokenId;
        private String tokenNumber;
        private int tokenSequence;
        private String opRegistrationNumber;
        private String patientName;
        private String patientPhone;
        private String registrationTypeName;
        private int priorityWeight;
        private QueueState queueState;
        private LocalDateTime calledAt;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;

        public QueueTokenDto() {}

        public String getTokenId() { return tokenId; }
        public void setTokenId(String tokenId) { this.tokenId = tokenId; }

        public String getTokenNumber() { return tokenNumber; }
        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

        public int getTokenSequence() { return tokenSequence; }
        public void setTokenSequence(int tokenSequence) { this.tokenSequence = tokenSequence; }

        public String getOpRegistrationNumber() { return opRegistrationNumber; }
        public void setOpRegistrationNumber(String opRegistrationNumber) { this.opRegistrationNumber = opRegistrationNumber; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getPatientPhone() { return patientPhone; }
        public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

        public String getRegistrationTypeName() { return registrationTypeName; }
        public void setRegistrationTypeName(String registrationTypeName) { this.registrationTypeName = registrationTypeName; }

        public int getPriorityWeight() { return priorityWeight; }
        public void setPriorityWeight(int priorityWeight) { this.priorityWeight = priorityWeight; }

        public QueueState getQueueState() { return queueState; }
        public void setQueueState(QueueState queueState) { this.queueState = queueState; }

        public LocalDateTime getCalledAt() { return calledAt; }
        public void setCalledAt(LocalDateTime calledAt) { this.calledAt = calledAt; }

        public LocalDateTime getStartedAt() { return startedAt; }
        public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

        public LocalDateTime getCompletedAt() { return completedAt; }
        public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    }

    public static class LiveQueueStatusDto {
        private String hospitalId;
        private String hospitalName;
        private String opRegistrationNumber;
        private String tokenNumber;
        private String registrationType;
        private QueueState queueState;
        private String currentTokenBeingCalled;
        private long patientsAhead;
        private int estimatedWaitingMinutes;
        private String receptionistPhone;
        private LocalDateTime lastUpdated;

        public LiveQueueStatusDto() {}

        public String getHospitalId() { return hospitalId; }
        public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

        public String getHospitalName() { return hospitalName; }
        public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

        public String getOpRegistrationNumber() { return opRegistrationNumber; }
        public void setOpRegistrationNumber(String opRegistrationNumber) { this.opRegistrationNumber = opRegistrationNumber; }

        public String getTokenNumber() { return tokenNumber; }
        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

        public String getRegistrationType() { return registrationType; }
        public void setRegistrationType(String registrationType) { this.registrationType = registrationType; }

        public QueueState getQueueState() { return queueState; }
        public void setQueueState(QueueState queueState) { this.queueState = queueState; }

        public String getCurrentTokenBeingCalled() { return currentTokenBeingCalled; }
        public void setCurrentTokenBeingCalled(String currentTokenBeingCalled) { this.currentTokenBeingCalled = currentTokenBeingCalled; }

        public long getPatientsAhead() { return patientsAhead; }
        public void setPatientsAhead(long patientsAhead) { this.patientsAhead = patientsAhead; }

        public int getEstimatedWaitingMinutes() { return estimatedWaitingMinutes; }
        public void setEstimatedWaitingMinutes(int estimatedWaitingMinutes) { this.estimatedWaitingMinutes = estimatedWaitingMinutes; }

        public String getReceptionistPhone() { return receptionistPhone; }
        public void setReceptionistPhone(String receptionistPhone) { this.receptionistPhone = receptionistPhone; }

        public LocalDateTime getLastUpdated() { return lastUpdated; }
        public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    }

    public static class ReceptionistQueueOverviewDto {
        private String hospitalId;
        private String hospitalName;
        private LocalDate sessionDate;
        private long totalRegistrations;
        private long waitingCount;
        private long calledCount;
        private long inConsultationCount;
        private long completedCount;
        private long noShowCount;
        private String currentNormalToken;
        private String currentSpecialToken;
        private List<QueueTokenDto> queueList;

        public ReceptionistQueueOverviewDto() {}

        public String getHospitalId() { return hospitalId; }
        public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

        public String getHospitalName() { return hospitalName; }
        public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

        public LocalDate getSessionDate() { return sessionDate; }
        public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

        public long getTotalRegistrations() { return totalRegistrations; }
        public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

        public long getWaitingCount() { return waitingCount; }
        public void setWaitingCount(long waitingCount) { this.waitingCount = waitingCount; }

        public long getCalledCount() { return calledCount; }
        public void setCalledCount(long calledCount) { this.calledCount = calledCount; }

        public long getInConsultationCount() { return inConsultationCount; }
        public void setInConsultationCount(long inConsultationCount) { this.inConsultationCount = inConsultationCount; }

        public long getCompletedCount() { return completedCount; }
        public void setCompletedCount(long completedCount) { this.completedCount = completedCount; }

        public long getNoShowCount() { return noShowCount; }
        public void setNoShowCount(long noShowCount) { this.noShowCount = noShowCount; }

        public String getCurrentNormalToken() { return currentNormalToken; }
        public void setCurrentNormalToken(String currentNormalToken) { this.currentNormalToken = currentNormalToken; }

        public String getCurrentSpecialToken() { return currentSpecialToken; }
        public void setCurrentSpecialToken(String currentSpecialToken) { this.currentSpecialToken = currentSpecialToken; }

        public List<QueueTokenDto> getQueueList() { return queueList; }
        public void setQueueList(List<QueueTokenDto> queueList) { this.queueList = queueList; }
    }

    public static class UpdateQueueStateRequest {
        @NotNull(message = "Target state is required")
        private QueueState targetState;

        private String reason;

        public UpdateQueueStateRequest() {}
        public UpdateQueueStateRequest(QueueState targetState, String reason) {
            this.targetState = targetState;
            this.reason = reason;
        }

        public QueueState getTargetState() { return targetState; }
        public void setTargetState(QueueState targetState) { this.targetState = targetState; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
