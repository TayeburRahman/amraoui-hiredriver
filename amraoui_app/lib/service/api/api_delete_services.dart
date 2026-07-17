import 'dart:async';
import 'dart:developer';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/service/api/api.dart';

import '../../const/storage/get_storage.dart';
import '../../routes/app_routes.dart';
import '../../widgets/app_snack_bar/app_snack_bar.dart';

class ApiDeleteServices {
  final api = AppApi();

  Future<dynamic> apiDeleteServices({
    required String url,
    Object? body,
    int statusCode = 200,
    Map<String, dynamic>? query,
    Options? options,
    String? token,
  }) async {
    try {
      final response = await api.sendRequest.delete(
        url,
        data: body,
        queryParameters: query,
        options: Options(headers: {"Authorization": token}),
      );
      if (response.statusCode == statusCode || token != null) {
        return response.data;
      } else {
        // Handle cases where status code is different
        AppSnackBar.error(
          "Unexpected response: ${response.statusCode} ${response.statusMessage}",
        );
        return null;
      }
    } on SocketException catch (e) {
      log("SocketException: $e");
      AppSnackBar.error("Check Your Internet Connection");
      return null;
    } on TimeoutException catch (e) {
      log("TimeoutException: $e");
      // AppSnackBar.error("Request Timed Out");
      return null;
    } on DioException catch (e) {
      // Log detailed Dio error information
      log("DioException: ${e.message}");
      log("DioError: ${e.response?.data}");
      log("Request Data: ${e.requestOptions.data}");
      log("Status Code: ${e.response?.statusCode}");

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
      log("Exception: $e");
      // AppSnackBar.error("Something Went Wrong");
      return null;
    }
  }
}
