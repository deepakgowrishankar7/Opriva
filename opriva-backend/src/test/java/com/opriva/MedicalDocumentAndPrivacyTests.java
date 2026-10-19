package com.opriva;

import com.opriva.dto.MedicalRecordDtos.MedicalDocumentDto;
import com.opriva.entity.User;
import com.opriva.enums.DocumentCategory;
import com.opriva.enums.Role;
import com.opriva.exception.UnauthorizedException;
import com.opriva.repository.UserRepository;
import com.opriva.service.AuthService;
import com.opriva.service.MedicalRecordService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class MedicalDocumentAndPrivacyTests {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Upload document and enforce strict object-level authorization across patients")
    public void testDocumentUploadAndAuthorizationBoundary() {
        User patientA = userRepository.findByEmail("patient@opriva.com").orElseThrow();

        // Create Patient B
        User patientB = new User();
        patientB.setId("usr-test-b");
        patientB.setEmail("patientB@test.com");
        patientB.setPhone("9988776655");
        patientB.setPasswordHash("hashed");
        patientB.setFullName("Patient B");
        patientB.setRole(Role.ROLE_PATIENT);
        patientB.setActive(true);
        userRepository.save(patientB);

        // Upload PDF report for Patient A
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "blood_test_report.pdf",
                "application/pdf",
                "%PDF-1.4 test report binary content".getBytes());

        MedicalDocumentDto uploaded = medicalRecordService.uploadDocument(
                file,
                DocumentCategory.LAB_REPORT,
                LocalDate.now(),
                "Annual comprehensive blood test",
                null,
                patientA);

        assertNotNull(uploaded);
        assertNotNull(uploaded.getId());
        assertEquals("blood_test_report.pdf", uploaded.getFileName());

        // Patient A can retrieve document
        byte[] content = medicalRecordService.retrieveDocumentFile(uploaded.getId(), patientA);
        assertNotNull(content);
        assertTrue(content.length > 0);

        // Patient B attempting to access Patient A's document MUST be rejected with UnauthorizedException
        assertThrows(UnauthorizedException.class, () -> {
            medicalRecordService.retrieveDocumentFile(uploaded.getId(), patientB);
        });
    }
}
