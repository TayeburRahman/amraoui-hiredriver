import 'dart:async';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/service/api/api.dart';

import '../../const/storage/get_storage.dart';
import '../../routes/app_routes.dart';
import '../../widgets/app_snack_bar/app_snack_bar.dart';

class ApiGetServices {
  final _api = AppApi();

  Future<dynamic> apiGetServices(
    String url, {
    int statusCode = 200,
    Map<String, dynamic>? queryParameters,
    // String? token,
  }) async {
    try {
      final response = await _api.sendRequest.get(
        url,
        queryParameters: queryParameters,
        // options: Options(
        //   headers: {
        //     "Authorization": "Bearer $token"
        //   },
        // ),
      );
      if (response.statusCode == statusCode) {
        return response.data;
      } else {
        return null;
      }
    } on SocketException catch (e) {
      debugPrint(e.toString());
      AppSnackBar.error("Check Your Internet Connection");
      return null;
    } on TimeoutException catch (e) {
      // AppSnackBar.error("Something Went Wrong");
      debugPrint(e.toString());
      return null;
    } on DioException catch (e) {
      // AppSnackBar.error("Something Went Wrong");
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
      debugPrint(e.toString());
      return null;
    } catch (e) {
      // AppSnackBar.error("Something Went Wrong");
      return null;
    }
  }
}
