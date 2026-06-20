import 'package:amraoui_app/service/api/api.dart';
import 'package:dio/dio.dart';

class NotificationRepository {
  final Dio _dio = AppApi().sendRequest;

  Future<Response> getNotifications() async {
    return await _dio.get('/notifications');
  }

  Future<Response> markAsRead(String id) async {
    return await _dio.patch('/notifications/$id/read', data: {});
  }

  Future<Response> markAllAsRead() async {
    return await _dio.patch('/notifications/mark-all-read', data: {});
  }
}
