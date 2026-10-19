import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../models/hospital_model.dart';
import '../../models/queue_token_model.dart';

class ApiService {
  // Use 10.0.2.2 for Android emulator, localhost for web/desktop, or custom LAN IP
  static const String baseUrl = 'http://10.0.2.2:8080/api/v1';
  static String? _cachedToken;

  static Future<String?> getToken() async {
    return _cachedToken;
  }

  static Future<void> saveToken(String token) async {
    _cachedToken = token;
  }

  static Future<List<HospitalModel>> fetchHospitals({String? keyword}) async {
    try {
      final token = await getToken();
      final uri = Uri.parse('$baseUrl/hospitals${keyword != null && keyword.isNotEmpty ? '?keyword=$keyword' : ''}');
      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        return data.map((json) => HospitalModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      // Fallback mock fixture for offline development demo
      return [
        HospitalModel(
          id: 'hosp-001',
          name: 'Apollo Health City',
          address: 'Road No. 72, Jubilee Hills, Hyderabad',
          locality: 'Jubilee Hills',
          city: 'Hyderabad',
          receptionistPhone: '+91-40-2360-7777',
          googleRating: 4.4,
          googleReviewCount: 8420,
          ratingAttribution: 'Verified Google Rating',
          verified: true,
          officialRegistrationNumber: 'REG-APO-TEL-2018-091',
          availableRegistrationTypes: [
            OpRegistrationTypeModel(
              id: 'type-001',
              typeCode: 'NORMAL',
              displayName: 'Normal OP Card',
              feeAmount: 350.0,
              currency: 'INR',
              priorityLevel: 1,
              description: 'Standard outpatient consultation card',
            ),
            OpRegistrationTypeModel(
              id: 'type-002',
              typeCode: 'SPECIAL',
              displayName: 'Special Priority OP Card',
              feeAmount: 750.0,
              currency: 'INR',
              priorityLevel: 2,
              description: 'Priority expedited consultation card',
            ),
          ],
        )
      ];
    }
  }

  static Future<LiveQueueStatusModel?> fetchLiveQueue(String registrationId) async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/queue/live/$registrationId'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return LiveQueueStatusModel.fromJson(json.decode(response.body));
      }
      return null;
    } catch (e) {
      return LiveQueueStatusModel(
        hospitalId: 'hosp-001',
        hospitalName: 'Apollo Health City',
        opRegistrationNumber: 'OPR-2026-HYD-004',
        tokenNumber: 'N-102',
        registrationType: 'Normal OP Card',
        queueState: 'WAITING',
        currentTokenBeingCalled: 'S-202',
        patientsAhead: 1,
        estimatedWaitingMinutes: 8,
        receptionistPhone: '+91-40-2360-7777',
        lastUpdated: DateTime.now().toIso8601String(),
      );
    }
  }
}
