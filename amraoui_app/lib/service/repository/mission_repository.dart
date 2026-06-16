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

  Future<Response> submitQuote(String missionId, double amount, String message, String estimatedTime) async {
    return await _auth.post('/requests/missions/$missionId/quote', data: {
      'amount': amount,
      'message': message,
      'estimatedTime': estimatedTime,
    });
  }
}
