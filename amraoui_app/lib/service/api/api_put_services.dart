import 'dart:async';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:amraoui_app/service/api/api.dart';

import '../../widgets/app_snack_bar/app_snack_bar.dart';

class ApiPutServices {
  final api = AppApi();

  Future<dynamic> apiPutServices({
    required String url,
    dynamic body,
    int statusCode = 200,
    Map<String, dynamic>? query,
  }) async {
    try {
      final response = await api.sendRequest.put(
        url,
        data: body,
        queryParameters: query,
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
      debugPrint(e.toString());
      return null;
    } catch (e) {
      // AppSnackBar.error("Something Went Wrong");
      return null;
    }
  }
}
