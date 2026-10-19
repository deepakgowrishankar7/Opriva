# Opriva — Current State Audit & Workspace Baseline
**Generated:** 2026-10-19  
**Platform:** Opriva — Healthcare, Without the Wait.

---

## 1. Existing Workspace Components & Preserved Assets

### A. Shared Backend (`c:\Opriva\opriva-backend\`)
- **Technology:** Java 17, Spring Boot 3.2.4, Spring Security, Spring Data JPA, Hibernate, Flyway, WebSocket STOMP.
- **Build Tool:** Portable Apache Maven 3.9.6 at `c:\Opriva\.tools\apache-maven-3.9.6\bin\mvn.cmd`.
- **Database Schema:** 19 relational tables in Flyway migrations:
  - `V1__init_schema.sql`: users, roles, hospitals, op_registration_types, slot_reservations, op_registrations, queue_tokens, queue_state_history, payments, digital_receipts, medical_documents, visit_records, prescriptions, notifications, audit_logs.
  - `V2__seed_hospitals.sql`: Apollo Jubilee Hills, KIMS Secunderabad, Manipal Bengaluru, GGH Hyderabad.
- **Security & Authorization:**
  - Stateless JWT token provider (`JwtTokenProvider.java`) with HMAC-SHA256.
  - Role-based Spring Security filter chain (`SecurityConfig.java`).
  - Strict role scopes: `ROLE_PATIENT`, `ROLE_RECEPTIONIST`, `ROLE_CLINICIAN`, `ROLE_SUPPORT`.
- **Automated Verification:** 5/5 automated test suites compile and pass:
  - `AuthAndSecurityTests`
  - `MedicalDocumentAndPrivacyTests`
  - `PaymentAndRegistrationTests`
  - `QueueStateMachineTests`
  - `BUILD SUCCESS` (0 failures, 0 errors).

### B. Shared Brand Assets (`c:\Opriva\assets\`)
- `opriva_symbol.png` (High-resolution 1024x1024 transparent symbol logo).
- Multi-density icons: `icon-32.png`, `icon-64.png`, `icon-192.png`, `icon-512.png`.
- Strictly maintains separation between the standalone symbol and the text wordmark "Opriva" with tagline *"Healthcare, Without the Wait."*.

### C. Current Web Project (`c:\Opriva\opriva-web\`)
- Currently contains a unified React 18 + Vite + TypeScript application with client-side tabs for Patient, Receptionist, and Clinician.
- **Audit Finding:** The prompt strictly forbids a single application with interchangeable role tabs. The Receptionist and Doctor portals must be **two completely separate, independent web applications** with their own layouts, routes, ports/deployments, and login flows.
- **Action Plan:** Split `opriva-web` into:
  1. `receptionist-web`: Standalone counter desk application (Port 5174 or dedicated route).
  2. `doctor-web`: Standalone clinical interface (Port 5175 or dedicated route).

### D. Patient Mobile Application (`c:\Opriva\opriva-mobile\`)
- **Technology:** Flutter 3, Dart, Material 3.
- **Audit Finding:** Contains base themes, 12-language localization (`AppLocalizations.dart`), models, and initial screens.
- **Action Plan:** Complete the full sequential patient journey:
  - Language selection onboarding
  - Nearest hospitals list with Google star ratings & review counts
  - OP card type selection (Normal vs Special Priority with pricing)
  - Patient & dependent details form
  - UPI QR Code scanner / payment view
  - Real-time live queue status (`patientsAhead`, `estimatedWaitingMinutes`, `tokenNumber`)
  - Report upload and history

---

## 2. Gap Analysis Against Master Prompt Non-Negotiables

| Requirement | Current Status | Remediation Required |
|-------------|----------------|----------------------|
| **Patient App is an APK** | Flutter project present (`opriva-mobile`) | Complete screens, localizations, and provide exact APK build configurations and instructions. |
| **Separate Receptionist Web App** | Combined in `opriva-web` | Factor out into dedicated `receptionist-web/` with independent build and counter dashboard. |
| **Separate Doctor Web App** | Combined in `opriva-web` | Factor out into dedicated `doctor-web/` with independent build, prescription signer, and report viewer. |
| **One Shared Backend & Database** | Verified in `opriva-backend` | Retain 100% of verified Spring Boot + Flyway database migrations and REST APIs. |
| **Server-Enforced Permissions** | Verified in Spring Security | Enforce independent token checks on every endpoint. |
| **Server-Side Verified Payment** | Verified | Retain signature verification before token allocation. |
| **12 Indian Languages + RTL** | Verified in web & mobile localizations | Maintain full coverage across all patient touchpoints. |
| **No Fabricated Records/Payments** | Verified | Clear Dev Mode tags, real cryptographic hashes on prescriptions. |

---

## 3. Preserved Work vs. Destructive Changes
- **No deletion of backend:** `opriva-backend` is already solid and passing all tests.
- **No loss of assets:** `opriva_symbol.png` and icons remain the brand source of truth.
- **Clean modularization:** Separate the web portals into distinct directories matching the master architecture specification.
