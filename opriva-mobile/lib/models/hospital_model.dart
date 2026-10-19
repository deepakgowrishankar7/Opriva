class OpRegistrationTypeModel {
  final String id;
  final String typeCode; // NORMAL or SPECIAL
  final String displayName;
  final double feeAmount;
  final String currency;
  final int priorityLevel;
  final String? description;

  OpRegistrationTypeModel({
    required this.id,
    required this.typeCode,
    required this.displayName,
    required this.feeAmount,
    required this.currency,
    required this.priorityLevel,
    this.description,
  });

  factory OpRegistrationTypeModel.fromJson(Map<String, dynamic> json) {
    return OpRegistrationTypeModel(
      id: json['id'] ?? '',
      typeCode: json['typeCode'] ?? 'NORMAL',
      displayName: json['displayName'] ?? 'Normal OP Card',
      feeAmount: (json['feeAmount'] as num?)?.toDouble() ?? 350.0,
      currency: json['currency'] ?? 'INR',
      priorityLevel: json['priorityLevel'] ?? 1,
      description: json['description'],
    );
  }
}

class HospitalModel {
  final String id;
  final String name;
  final String address;
  final String locality;
  final String city;
  final String? postalCode;
  final double? latitude;
  final double? longitude;
  final double? distanceKm;
  final String? receptionistPhone;
  final double? googleRating;
  final int? googleReviewCount;
  final String ratingAttribution;
  final bool verified;
  final String officialRegistrationNumber;
  final List<OpRegistrationTypeModel> availableRegistrationTypes;

  HospitalModel({
    required this.id,
    required this.name,
    required this.address,
    required this.locality,
    required this.city,
    this.postalCode,
    this.latitude,
    this.longitude,
    this.distanceKm,
    this.receptionistPhone,
    this.googleRating,
    this.googleReviewCount,
    required this.ratingAttribution,
    required this.verified,
    required this.officialRegistrationNumber,
    required this.availableRegistrationTypes,
  });

  factory HospitalModel.fromJson(Map<String, dynamic> json) {
    var list = json['availableRegistrationTypes'] as List? ?? [];
    List<OpRegistrationTypeModel> types =
        list.map((i) => OpRegistrationTypeModel.fromJson(i)).toList();

    return HospitalModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      locality: json['locality'] ?? '',
      city: json['city'] ?? '',
      postalCode: json['postalCode'],
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      distanceKm: (json['distanceKm'] as num?)?.toDouble(),
      receptionistPhone: json['receptionistPhone'],
      googleRating: (json['googleRating'] as num?)?.toDouble(),
      googleReviewCount: json['googleReviewCount'],
      ratingAttribution: json['ratingAttribution'] ?? 'Verified Google Rating',
      verified: json['verified'] ?? false,
      officialRegistrationNumber: json['officialRegistrationNumber'] ?? 'Not provided',
      availableRegistrationTypes: types,
    );
  }
}
