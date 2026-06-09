import 'dart:async';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:amraoui_app/service/api/api.dart';
import 'package:amraoui_app/service/api/non_auth_api.dart';
import 'package:amraoui_app/widgets/log_print/app_log.dart';
import '../../widgets/app_snack_bar/app_snack_bar.dart';

class ApiPostServices {
  Future<dynamic> apiPostServices({
    required String url,
    dynamic body,
    int statusStartCode = 200,
    int statusEndCode = 290,
    Map<String, dynamic>? query,
    String? token,
    String? recentToken,
    Options? options,
  }) async {
    // Dio dio = Dio(BaseOptions(
    //   receiveTimeout: Duration(seconds: 120000), // 120 seconds
    //   connectTimeout: Duration(seconds: 120000), // 120 seconds
    // ));
    Response response;
    try {
      if (token != null) {
        response = await NonAuthApi().sendRequest.post(
          url,
          data: body,
          options: Options(headers: {"Authorization": "Bearer $token"}),
        );
      } else if (recentToken != null) {
        response = await AppApi().sendRequest.post(
          url,
          data: body,
          options: Options(headers: {"resettoken": recentToken.toString()}),
        );
      } else {
        response = await AppApi().sendRequest.post(
          url,
          options: options,
          data: body,
          queryParameters: query,
        );
      }
      var statusCode = response.statusCode ?? 0;
      if (statusCode >= statusStartCode && statusCode <= statusEndCode) {
        return response.data;
      } else {
        return null;
      }
    } on SocketException catch (e) {
      appLog(e.toString());
      AppSnackBar.error("Check Your Internet Connection");
      return null;
    } on TimeoutException catch (e) {
      // AppSnackBar.error("Something Went Wrong");
      appLog(e.toString());
      return null;
    } on DioException catch (e) {
      if (e.response.runtimeType != Null) {
        if (e.response?.data["message"].runtimeType != Null) {
          AppSnackBar.error("${e.response?.data["message"]}");
        }
        return null;
      }
      appLog(e.toString());
      return null;
    } catch (e) {
      // AppSnackBar.error("Something Went Wrong");
      appLog(e.toString());
      return null;
    }
  }
}
