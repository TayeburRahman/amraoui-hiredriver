import 'package:flutter/material.dart';
import 'package:Vehiqqo/const/storage/get_storage.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:Vehiqqo/utils/auth_navigation.dart';
import 'package:Vehiqqo/service/repository/auth_repository.dart';
import 'package:Vehiqqo/widgets/log_print/error_log.dart';
import 'package:dio/dio.dart';
import 'package:get/get.dart';

class SplashScreenController extends GetxController {
  // Future<void> goToNextScreen() async {
  // await Future.delayed(
  //   const Duration(seconds: 1),
  //   () {
  //     // Get.toNamed(AppRoutes.profileInitialScreen);
  //     // selectedUser = UserType.provider;
  //     // Get.offAllNamed(AppRoutes.navigationScreen);

  //     if (AppStorage().getValue(StorageKey.onBoardValue) == null) {
  //       Get.toNamed(AppRoutes.onBoardScreen);
  //     } else {
  //       if (AppStorage().getToken().isEmpty) {
  //         Get.offAllNamed(AppRoutes.signIn);
  //       } else {
  //         // if (AppStorage().getValue(StorageKey.loginValue) == "USER") {
  //         //   selectedUser = UserType.user;
  //         // } else if (AppStorage().getValue(StorageKey.loginValue) ==
  //         //     "SERVICE_PROVIDER") {
  //         //   selectedUser = UserType.serviceProvider;
  //         // }
  //         selectedUser = AppStorage().getAppRole();
  //         Get.offAllNamed(AppRoutes.navigationScreen);
  //         // selectedUser = UserType.user;
  //       }
  //     }
  //   },
  // );
  // }

  Future<void> nextScreen() async {
    try {
      var onboard = AppStorage().getValue(StorageKey.onBoardValue);
      var token = AppStorage().getToken();
      if (onboard == null) {
        Get.toNamed(AppRoutes.onBoardScreen);
        return;
      }
      if (token.isEmpty) {
        Get.offAllNamed(AppRoutes.signIn);
        return;
      }
      if (token.isNotEmpty) {
        try {
          final profile = await AuthRepository().getProfile();
          if (profile != null) {
            final refresh = AppStorage().getRefreshToken() ?? '';
            await AuthNavigation.saveSession(
              accessToken: token,
              refreshToken: refresh,
              driver: profile,
            );
            AuthNavigation.routeDriver(profile);
            return;
          }
        } on DioException catch (e) {
          if (e.response?.statusCode == 401) {
            await AppStorage().removeValue(StorageKey.token);
            Get.offAllNamed(AppRoutes.signIn);
            return;
          }
        } catch (_) {}
        AuthNavigation.routeFromStoredSession();
      }
    } catch (e) {
      errorLog("nextScreen splash", e);
      WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
        Get.offAllNamed(AppRoutes.signIn);
      });
    }
  }

  void onAppInitialDataLoad() {
    Future.delayed(const Duration(seconds: 1), () {
      nextScreen();
    });
  }

  @override
  void onInit() {
    onAppInitialDataLoad();
    super.onInit();
    // await goToNextScreen();
  }
}
