import 'package:amraoui_app/service/api/api.dart';
import 'package:dio/dio.dart';

class MissionRepository {
  final Dio _auth = AppApi().sendRequest;

  Future<Response> getMissions() async {
    return await _auth.get('/requests/missions');
  }

  Future<Response> startMission(String id) async {
    return await _auth.patch('/requests/missions/$id/start');
  }

  Future<Response> cancelMission(String id, String reason, String note) async {
    return await _auth.patch('/requests/missions/$id/cancel', data: {
      'reason': reason,
      'note': note,
    });
  }

  Future<Response> submitQuote(
    String missionId,
    double amount, {
    double servicePrice = 0,
    double fuelCost = 0,
    double tollCharges = 0,
    double travelCost = 0,
    double taxiCost = 0,
    String? message,
    String? pickupDate,
    String? pickupTime,
    String? dropoffDate,
    String? dropoffTime,
  }) async {
    return await _auth.post('/requests/missions/$missionId/quote', data: {
      'amount': amount,
      'servicePrice': servicePrice,
      'fuelCost': fuelCost,
      'tollCharges': tollCharges,
      'travelCost': travelCost,
      'taxiCost': taxiCost,
      if (message != null) 'message': message,
      if (pickupDate != null) 'pickupDate': pickupDate,
      if (pickupTime != null) 'pickupTime': pickupTime,
      if (dropoffDate != null) 'dropoffDate': dropoffDate,
      if (dropoffTime != null) 'dropoffTime': dropoffTime,
    });
  }

  Future<Response> verifyPickup(String id, double lat, double lng, {String? date}) async {
    return await _auth.patch('/requests/missions/$id/pickup-verification', data: {
      'lat': lat,
      'lng': lng,
      if (date != null) 'date': date,
    });
  }

  Future<Response> verifyDeliveryArrival(String id, double lat, double lng) async {
    return await _auth.patch('/requests/missions/$id/delivery-arrival', data: {
      'lat': lat,
      'lng': lng,
    });
  }

  Future<Response> updatePickupInspection(String id, String section, Map<String, dynamic> data) async {
    FormData formData = FormData.fromMap({
      'section': section,
      ...data
    });

    return await _auth.patch('/requests/missions/$id/pickup-inspection', data: formData);
  }

  Future<Response> updateDeliveryInspection(String id, String section, Map<String, dynamic> data) async {
    FormData formData = FormData.fromMap({
      'section': section,
      ...data
    });

    return await _auth.patch('/requests/missions/$id/delivery-inspection', data: formData);
  }
}
