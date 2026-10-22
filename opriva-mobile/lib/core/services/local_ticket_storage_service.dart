import 'dart:convert';

class LocalPatientTicket {
  final String hospitalId;
  final String hospitalName;
  final String branchName;
  final String opRegistrationNumber;
  final String tokenNumber;
  final String cardTypeName;
  final String patientName;
  final double feePaid;
  final String currentTokenCalled;
  final int patientsAhead;
  final int estWaitMinutes;
  final String receptionistPhone;
  final double? latitude;
  final double? longitude;
  final String? address;
  final DateTime bookedAt;

  LocalPatientTicket({
    required this.hospitalId,
    required this.hospitalName,
    required this.branchName,
    required this.opRegistrationNumber,
    required this.tokenNumber,
    required this.cardTypeName,
    required this.patientName,
    required this.feePaid,
    required this.currentTokenCalled,
    required this.patientsAhead,
    required this.estWaitMinutes,
    required this.receptionistPhone,
    this.latitude,
    this.longitude,
    this.address,
    required this.bookedAt,
  });

  Map<String, dynamic> toJson() => {
    'hospitalId': hospitalId,
    'hospitalName': hospitalName,
    'branchName': branchName,
    'opRegistrationNumber': opRegistrationNumber,
    'tokenNumber': tokenNumber,
    'cardTypeName': cardTypeName,
    'patientName': patientName,
    'feePaid': feePaid,
    'currentTokenCalled': currentTokenCalled,
    'patientsAhead': patientsAhead,
    'estWaitMinutes': estWaitMinutes,
    'receptionistPhone': receptionistPhone,
    'latitude': latitude,
    'longitude': longitude,
    'address': address,
    'bookedAt': bookedAt.toIso8601String(),
  };

  factory LocalPatientTicket.fromJson(Map<String, dynamic> map) => LocalPatientTicket(
    hospitalId: map['hospitalId'] ?? '',
    hospitalName: map['hospitalName'] ?? '',
    branchName: map['branchName'] ?? '',
    opRegistrationNumber: map['opRegistrationNumber'] ?? '',
    tokenNumber: map['tokenNumber'] ?? '',
    cardTypeName: map['cardTypeName'] ?? 'Normal OP Card',
    patientName: map['patientName'] ?? '',
    feePaid: (map['feePaid'] as num?)?.toDouble() ?? 350.0,
    currentTokenCalled: map['currentTokenCalled'] ?? 'N-100',
    patientsAhead: map['patientsAhead'] ?? 0,
    estWaitMinutes: map['estWaitMinutes'] ?? 0,
    receptionistPhone: map['receptionistPhone'] ?? '+91-40-2360-7777',
    latitude: (map['latitude'] as num?)?.toDouble(),
    longitude: (map['longitude'] as num?)?.toDouble(),
    address: map['address'],
    bookedAt: DateTime.tryParse(map['bookedAt'] ?? '') ?? DateTime.now(),
  );
}

class PatientAccount {
  final String fullName;
  final String phone;
  final String email;
  final String password;
  final List<LocalPatientTicket> tickets;

  PatientAccount({
    required this.fullName,
    required this.phone,
    required this.email,
    required this.password,
    List<LocalPatientTicket>? tickets,
  }) : tickets = tickets ?? [];
}

class LocalTicketStorageService {
  // Accounts registered on device (keyed by phone or email)
  static final Map<String, PatientAccount> _accounts = {
    // Default demo patient account for immediate testing
    '9876543210': PatientAccount(
      fullName: 'Ananya Sharma',
      phone: '9876543210',
      email: 'patient@opriva.com',
      password: 'password123',
    )
  };

  // Currently logged in patient session
  static PatientAccount? _currentLoggedInPatient;

  static PatientAccount? get currentPatient => _currentLoggedInPatient;
  static bool get isLoggedIn => _currentLoggedInPatient != null;

  static bool register({
    required String fullName,
    required String phone,
    required String email,
    required String password,
  }) {
    final cleanPhone = phone.trim();
    if (_accounts.containsKey(cleanPhone)) {
      return false; // already registered
    }
    final newAccount = PatientAccount(
      fullName: fullName.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      password: password,
    );
    _accounts[cleanPhone] = newAccount;
    _currentLoggedInPatient = newAccount;
    return true;
  }

  static bool login(String phoneOrEmail, String password) {
    final query = phoneOrEmail.trim().toLowerCase();
    for (var acc in _accounts.values) {
      if ((acc.phone == query || acc.email == query) && acc.password == password) {
        _currentLoggedInPatient = acc;
        return true;
      }
    }
    return false;
  }

  static void logout() {
    _currentLoggedInPatient = null;
  }

  // Returns tickets strictly belonging to the logged-in patient
  static List<LocalPatientTicket> getDeviceTickets() {
    if (_currentLoggedInPatient == null) {
      return const [];
    }
    return List.unmodifiable(_currentLoggedInPatient!.tickets);
  }

  static LocalPatientTicket? getActiveTicket() {
    final tickets = getDeviceTickets();
    if (tickets.isEmpty) return null;
    return tickets.first;
  }

  static void saveTicket(LocalPatientTicket ticket) {
    if (_currentLoggedInPatient != null) {
      _currentLoggedInPatient!.tickets.insert(0, ticket);
    } else {
      // If user booked as guest, associate with guest session
      if (!_accounts.containsKey('guest')) {
        _accounts['guest'] = PatientAccount(
          fullName: ticket.patientName,
          phone: 'guest',
          email: 'guest@opriva.com',
          password: 'pass',
        );
      }
      _accounts['guest']!.tickets.insert(0, ticket);
      _currentLoggedInPatient = _accounts['guest'];
    }
  }

  static void clearTickets() {
    _currentLoggedInPatient?.tickets.clear();
  }
}
