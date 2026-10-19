package com.opriva.service;

import com.opriva.dto.MedicalRecordDtos.CreateDependentRequest;
import com.opriva.dto.MedicalRecordDtos.DependentDto;
import com.opriva.entity.Dependent;
import com.opriva.entity.User;
import com.opriva.exception.ResourceNotFoundException;
import com.opriva.repository.DependentRepository;
import com.opriva.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DependentService {

    private final DependentRepository dependentRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public DependentService(
            DependentRepository dependentRepository,
            UserRepository userRepository,
            AuditService auditService) {
        this.dependentRepository = dependentRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public DependentDto createDependent(CreateDependentRequest request, String primaryUserId) {
        User primaryUser = userRepository.findById(primaryUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Primary user not found: " + primaryUserId));

        Dependent dependent = new Dependent();
        dependent.setId(UUID.randomUUID().toString());
        dependent.setPrimaryPatient(primaryUser);
        dependent.setFullName(request.getFullName());
        dependent.setRelationship(request.getRelationship());
        dependent.setDateOfBirth(request.getDateOfBirth());
        dependent.setGender(request.getGender());
        dependent.setBloodGroup(request.getBloodGroup());
        dependent.setCreatedAt(LocalDateTime.now());
        dependent.setUpdatedAt(LocalDateTime.now());

        Dependent saved = dependentRepository.save(dependent);

        auditService.logAction(primaryUserId, "ADD_DEPENDENT", "Dependent", saved.getId(),
                "Added dependent " + request.getFullName() + " (" + request.getRelationship() + ")", null);

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<DependentDto> getDependents(String primaryUserId) {
        return dependentRepository.findByPrimaryPatientId(primaryUserId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private DependentDto mapToDto(Dependent d) {
        DependentDto dto = new DependentDto();
        dto.setId(d.getId());
        dto.setFullName(d.getFullName());
        dto.setRelationship(d.getRelationship());
        dto.setDateOfBirth(d.getDateOfBirth());
        dto.setGender(d.getGender());
        dto.setBloodGroup(d.getBloodGroup());
        return dto;
    }
}
