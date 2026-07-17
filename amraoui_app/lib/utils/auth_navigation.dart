import 'dart:convert';
import 'package:Vehiqqo/const/storage/get_storage.dart';
import 'package:Vehiqqo/models/driver_model.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:get/get.dart';

class AuthNavigation {
  static Future<void> saveSession({
    required String accessToken,
    required String refreshToken,
    required DriverModel driver,
  }) async {
    await AppStorage().setToken(accessToken);
    await AppStorage().setRefreshToken(refreshToken);
    await AppStorage().setAppRole('DRIVER');
    await AppStorage().setValue(
      StorageKey.userInfo,
      jsonEncode(driver.toJson()),
    );
  }

  static DriverModel? getStoredDriver() {
    final raw = AppStorage().getValue(StorageKey.userInfo);
    if (raw == null) return null;
    try {
      return DriverModel.fromJson(jsonDecode(raw.toString()));
    } catch (_) {
      return null;
    }
  }

  static void routeDriver(DriverModel driver) {
    if (driver.isApproved) {
      Get.offAllNamed(AppRoutes.navigationScreen);
    } else if (!driver.documentsSubmitted) {
      Get.offAllNamed(AppRoutes.submitDocuments);
    } else {
      Get.offAllNamed(AppRoutes.pendingApproval);
    }
  }

  static Future<void> routeFromStoredSession() async {
    final token = AppStorage().getToken();
    if (token.isEmpty) {
      Get.offAllNamed(AppRoutes.signIn);
      return;
    }
    final driver = getStoredDriver();
    if (driver == null) {
      Get.offAllNamed(AppRoutes.signIn);
      return;
    }
    routeDriver(driver);
  }
}
