class LiveQueueStatusModel {
  final String hospitalId;
  final String hospitalName;
  final String opRegistrationNumber;
  final String tokenNumber;
  final String registrationType;
  final String queueState;
  final String currentTokenBeingCalled;
  final int patientsAhead;
  final int estimatedWaitingMinutes;
  final String receptionistPhone;
  final String lastUpdated;

  LiveQueueStatusModel({
    required this.hospitalId,
    required this.hospitalName,
    required this.opRegistrationNumber,
    required this.tokenNumber,
    required this.registrationType,
    required this.queueState,
    required this.currentTokenBeingCalled,
    required this.patientsAhead,
    required this.estimatedWaitingMinutes,
    required this.receptionistPhone,
    required this.lastUpdated,
  });

  factory LiveQueueStatusModel.fromJson(Map<String, dynamic> json) {
    return LiveQueueStatusModel(
      hospitalId: json['hospitalId'] ?? '',
      hospitalName: json['hospitalName'] ?? '',
      opRegistrationNumber: json['opRegistrationNumber'] ?? '',
      tokenNumber: json['tokenNumber'] ?? '',
      registrationType: json['registrationType'] ?? '',
      queueState: json['queueState'] ?? 'WAITING',
      currentTokenBeingCalled: json['currentTokenBeingCalled'] ?? 'None',
      patientsAhead: json['patientsAhead'] ?? 0,
      estimatedWaitingMinutes: json['estimatedWaitingMinutes'] ?? 0,
      receptionistPhone: json['receptionistPhone'] ?? 'Not provided',
      lastUpdated: json['lastUpdated'] ?? '',
    );
  }
}
