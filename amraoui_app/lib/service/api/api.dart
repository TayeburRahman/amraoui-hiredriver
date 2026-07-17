import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:Vehiqqo/widgets/log_print/app_log.dart';
import 'package:get/get.dart' hide FormData, MultipartFile;
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import '../../const/api_url/api_url.dart';
import '../../const/storage/get_storage.dart';
import '../../routes/app_routes.dart';
import '../../widgets/app_snack_bar/app_snack_bar.dart';

class AppApi {
  final Dio _dio = Dio();

  AppApi() {
    _dio.options.baseUrl = AppApiUrl.baseUrl;
    _dio.options.sendTimeout = const Duration(seconds: 180);
    _dio.options.connectTimeout = const Duration(seconds: 180);
    _dio.options.receiveTimeout = const Duration(seconds: 180);
    _dio.options.followRedirects = false;

    _dio.interceptors.addAll({
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          options.baseUrl = AppApiUrl.baseUrl;
          if (options.data is! FormData) {
            options.contentType = 'application/json';
          }
          options.headers["Accept"] = "application/json";

          String token = AppStorage().getToken();
          if (token.isNotEmpty) {
            options.headers["Authorization"] = "Bearer $token";
          }

          return handler.next(options); // Continue request
        },
        onError: (error, handler) async {
          appLog("API error occurred:");
          appLog("Status code: ${error.response?.statusCode}");
          appLog("Error message: ${error.message}");

          if (error.response?.statusCode == 401) {
            // Unauthorized error, attempt token refresh
            final newAccessToken = await reFreshNewAccessToken();

            if (newAccessToken != null) {
              // Update the request with the new token and retry
              _dio.options.headers["Authorization"] = "Bearer $newAccessToken";
              return handler.resolve(await _dio.fetch(error.requestOptions));
            } else {
              // Token refresh failed, clear storage and redirect to login
              AppSnackBar.error("Sign in again!");
              await AppStorage().removeValue(StorageKey.token);
              if (Get.currentRoute != AppRoutes.initial &&
                  Get.currentRoute != AppRoutes.signIn) {
                Get.offAllNamed(AppRoutes.signIn);
              }
              return handler.next(error);
            }
          }

          return handler.next(error); // Continue with error
        },
      ),
      if (kDebugMode)
        PrettyDioLogger(
          requestHeader: true,
          request: true,
          compact: true,
          error: true,
          requestBody: true,
          responseHeader: true,
          responseBody: true,
        ),
    });
  }

  // Token refresh logic

  Dio get sendRequest => _dio;
}

Future<String?> reFreshNewAccessToken() async {
  try {
    String? token = AppStorage().getRefreshToken();

    if (token != null) {
      final response = await Dio().post(
        '${AppApiUrl.baseUrl}${AppApiUrl.refreshTokenUrl}',
        data: {"refreshToken": token},
      );
      if (response.statusCode == 200) {
        String? newAccessToken = response.data["data"]["accessToken"];

        if (newAccessToken != null) {
          // Store new token
          await AppStorage().setToken(newAccessToken);
          return newAccessToken;
        }
      }
    }
  } catch (e) {
    appLog("Token refresh failed: $e");
  }

  return null;
}
