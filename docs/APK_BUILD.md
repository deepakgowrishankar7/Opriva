# Opriva — Android APK Build & Installation Guide

This guide describes how to build, sign, and install the **Opriva Patient Mobile Application** onto any Android smartphone or emulator.

---

## 1. Prerequisites
- **Flutter SDK** (v3.19+ or compatible Dart 3.x)
- **Android Studio & Android SDK** (API Level 34 / Android 14)
- **Java JDK 17** (verified on system at `C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot\`)

---

## 2. Patient Mobile App Structure
The mobile app is located at:
```text
c:\Opriva\opriva-mobile\
├── lib/
│   ├── main.dart                               # Entry point + 12-language localization
│   ├── core/
│   │   ├── localization/app_localizations.dart # 12 Indian Languages + Urdu RTL
│   │   ├── services/api_service.dart           # Backend REST API client
│   │   └── theme/opriva_theme.dart             # Material 3 Navy/Teal Healthcare theme
│   ├── models/
│   │   ├── hospital_model.dart                 # Nearest distance, Google rating, OP card types
│   │   └── queue_token_model.dart              # Live token, patients ahead, est. wait
│   └── screens/
│       ├── splash_screen.dart                  # Opriva symbol + tagline
│       ├── home_hospital_screen.dart           # Hospital discovery (nearest first) + search
│       ├── op_card_selection_screen.dart       # Normal OP vs Special Priority OP
│       ├── patient_details_screen.dart         # Name, age, phone, upload old reports
│       ├── upi_qr_payment_screen.dart          # 10-minute timer + UPI QR scanner
│       ├── live_queue_tracker_screen.dart      # Real-time token caller + desk contact
│       └── medical_reports_screen.dart         # Lab reports & digital prescriptions
├── assets/images/opriva_symbol.png             # Official high-res symbol logo
└── pubspec.yaml                                # Dependencies
```

---

## 3. Steps to Build the Android APK

### Step A: Verify Flutter Installation
Open PowerShell and verify Flutter is in your path:
```powershell
flutter --version
flutter doctor
```

### Step B: Fetch Flutter Dependencies
```powershell
cd c:\Opriva\opriva-mobile
flutter pub get
```

### Step C: Build Debug APK (For Immediate Device Testing)
```powershell
flutter build apk --debug
```
**Output Artifact Location:**
`c:\Opriva\opriva-mobile\build\app\outputs\flutter-apk\app-debug.apk`

### Step D: Build Release APK (For Production / Distribution)
```powershell
flutter build apk --release
```
**Output Artifact Location:**
`c:\Opriva\opriva-mobile\build\app\outputs\flutter-apk\app-release.apk`

---

## 4. Installing the APK on a Real Android Device

1. Connect your Android phone to the computer using a USB cable.
2. On your phone, enable **Developer Options** and turn on **USB Debugging**.
3. In PowerShell, install the generated APK directly:
```powershell
adb install -r build\app\outputs\flutter-apk\app-debug.apk
```
*Alternatively, copy `app-debug.apk` directly to your phone via Google Drive, WhatsApp, or USB File Transfer and tap to install.*

---

## 5. Live Backend Connectivity Configuration
By default, the Flutter app connects to `http://10.0.2.2:8080/api/v1` for the Android emulator, or your computer's local IP address (e.g. `http://10.47.0.111:8080/api/v1`) when testing on a physical phone on the same Wi-Fi.

For production deployment, update `api_service.dart` with your deployed HTTPS backend URL:
```dart
static const String baseUrl = 'https://api.opriva.com/api/v1';
```
