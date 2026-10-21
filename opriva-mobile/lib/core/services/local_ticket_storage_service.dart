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
    bookedAt: DateTime.tryParse(map['bookedAt'] ?? '') ?? DateTime.now(),
  );
}

class LocalTicketStorageService {
  // Pure in-memory session cache that holds only THIS device's tickets.
  // Defaults strictly to an EMPTY list on a fresh phone install so NO foreign data leaks.
  static final List<LocalPatientTicket> _deviceTickets = [];

  static List<LocalPatientTicket> getDeviceTickets() {
    return List.unmodifiable(_deviceTickets);
  }

  static LocalPatientTicket? getActiveTicket() {
    if (_deviceTickets.isEmpty) return null;
    return _deviceTickets.first;
  }

  static void saveTicket(LocalPatientTicket ticket) {
    _deviceTickets.insert(0, ticket);
  }

  static void clearTickets() {
    _deviceTickets.clear();
  }
}
