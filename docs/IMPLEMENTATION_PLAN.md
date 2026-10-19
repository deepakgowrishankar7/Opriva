# Opriva — Master Implementation Plan
**Version:** 2.0  
**Target:** 3 Independent Applications + 1 Shared Backend

---

## Architecture Breakdown

```
c:\Opriva\
├── opriva-backend/          <-- Shared Spring Boot 3.2.4 REST API & WebSocket STOMP
├── opriva-mobile/           <-- App A: Standalone Patient Flutter Mobile App (Android APK)
├── receptionist-web/        <-- App B: Standalone Receptionist Desktop Web App (Port 5174)
├── doctor-web/              <-- App C: Standalone Doctor/Clinician Desktop Web App (Port 5175)
├── assets/                  <-- Shared high-res symbol logo & multi-density icons
├── docs/                    <-- Full system documentation & specifications
├── .env.example             <-- Environment variables template
├── run-backend.bat          <-- Launch backend
├── run-receptionist.bat     <-- Launch Receptionist counter portal
└── run-doctor.bat           <-- Launch Doctor clinical portal
```

---

## Phase Execution Roadmap

### Phase 1: Complete Patient Mobile App Journey (`opriva-mobile`)
- [x] Theme & 12 Indian languages with RTL for Urdu (`AppLocalizations.dart`).
- [x] Initial screens (`SplashScreen.dart`, `HomeHospitalScreen.dart`).
- [ ] Add `OpCardSelectionScreen.dart` (Normal OP vs Special Priority OP with fees).
- [ ] Add `PatientDetailsFormScreen.dart` (Name, Age, Phone, Medical report attachment).
- [ ] Add `UpiQrPaymentScreen.dart` (Live UPI QR code generator + 10-minute hold timer).
- [ ] Add `LiveQueueTrackerScreen.dart` (Token card, patients ahead, est. wait time, WebSocket/poll updates).
- [ ] Add `MedicalReportsScreen.dart` (Upload lab report, view prescriptions).
- [ ] Configure Android build scripts and provide APK generation instructions.

### Phase 2: Independent Receptionist Web App (`receptionist-web`)
- [ ] Create dedicated `receptionist-web` Vite + React + TypeScript project.
- [ ] Independent login: `receptionist@apollo.opriva.com` / `password123`.
- [ ] Counter desk dashboard: live queue table, "Call Next Token", state transitions (`CALLED`, `IN_CONSULTATION`, `COMPLETED`, `MISSED`).
- [ ] Walk-in patient registration form with cash/counter payment logging.
- [ ] Printable PDF / Slip generation for tokens and receipts.
- [ ] Strict exclusion of doctor schedules and clinical records.

### Phase 3: Independent Doctor Web App (`doctor-web`)
- [ ] Create dedicated `doctor-web` Vite + React + TypeScript project.
- [ ] Independent login: `dr.sharma@apollo.opriva.com` / `password123`.
- [ ] Patient lookup by OP Registration ID or Token.
- [ ] Consent-governed medical records & report viewer.
- [ ] Digital Prescription Builder with drug dosage, frequency, instructions.
- [ ] Cryptographic SHA-256 digital signature generator for finalized prescriptions.
- [ ] Strict exclusion of receptionist counter controls and financial transactions.

### Phase 4: Shared Backend & Database Hardening (`opriva-backend`)
- [x] Flyway migrations V1 & V2 (19 tables).
- [x] JWT authentication and role-based security filters.
- [x] Server-side verified payments and idempotent token allocation.
- [x] Real-time WebSocket STOMP queues.
- [x] Pass all 5 unit and integration test suites.

### Phase 5: Verification, Acceptance Checklist & Documentation
- [ ] Run backend automated test suite.
- [ ] Verify independent builds of `receptionist-web` and `doctor-web`.
- [ ] Verify `opriva-mobile` Dart/Flutter screens.
- [ ] Generate comprehensive documentation in `docs/` (Architecture, Database, API, Security, Payments, Queue, Deployment, APK Build).
