import 'dart:convert';
import 'package:amraoui_app/const/api_url/api_url.dart';
import 'package:amraoui_app/service/api/api.dart';
import 'package:dio/dio.dart';

class MissionRepository {
  final Dio _api = AppApi().sendRequest;

  Future<Response> getMissions() async {
    try {
      final res = await _api.get(AppApiUrl.missionsUrl);
      return res;
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> submitQuote(String missionId, double amount, String message, String estimatedTime) async {
    try {
      final res = await _api.post(
        '${AppApiUrl.submitDriverQuoteUrl}/$missionId/driver-quote',
        data: jsonEncode({
          "amount": amount,
          "message": message,
          "estimatedTime": estimatedTime,
          // Need to send driverId if backend requires it, but ideally backend decodes from token
          // For now, if the driverId is required, we pass a mock one, but backend should use req.user.id
        }),
      );
      return res;
    } catch (e) {
      rethrow;
    }
  }
}
