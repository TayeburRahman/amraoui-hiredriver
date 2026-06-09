import 'dart:async';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:amraoui_app/widgets/log_print/app_log.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/service/api/api.dart';
import '../../const/storage/get_storage.dart';
import '../../routes/app_routes.dart';
import '../../widgets/app_snack_bar/app_snack_bar.dart';

class ApiPatchServices {
  final api = AppApi();

  Future<dynamic> apiPatchServices({
    required String url,
    Object? body,
    int statusStartCode = 200,
    int statusEndCode = 290,
    Map<String, dynamic>? query,
    Options? options,
    String? token,
  }) async {
    try {
      final response = await api.sendRequest.patch(
        url,
        data: body,
        queryParameters: query,
        options: Options(headers: {"Authorization": token}),
      );
      var statusCode = response.statusCode ?? 0;
      if (statusStartCode >= statusCode && statusCode <= statusEndCode) {
        return response.data;
      } else {
        // Handle cases where status code is different
        AppSnackBar.error(
          "Unexpected response: ${response.statusCode} ${response.statusMessage}",
        );
        return null;
      }
    } on SocketException catch (e) {
      appLog("SocketException: $e");
      AppSnackBar.error("Check Your Internet Connection");
      return null;
    } on TimeoutException catch (e) {
      appLog("TimeoutException: $e");
      // AppSnackBar.error("Request Timed Out");
      return null;
    } on DioException catch (e) {
      // Log detailed Dio error information
      appLog("DioException: ${e.message}");
      appLog("DioError: ${e.response?.data}");
      appLog("Request Data: ${e.requestOptions.data}");
      appLog("Status Code: ${e.response?.statusCode}");

      if (e.response.runtimeType != Null) {
        if (e.response?.statusCode == 400) {
          if (e.response?.data["message"].runtimeType != Null) {
            AppSnackBar.error("${e.response?.data["message"]}");
          }
          return null;
        } else if (e.response?.statusCode == 401) {
          await AppStorage().storageAllClear();
          Get.offAllNamed(AppRoutes.signIn);
        }
      }
      return null;
    } catch (e) {
      appLog("Exception: $e");
      // AppSnackBar.error("Something Went Wrong");
      return null;
    }
  }
}
