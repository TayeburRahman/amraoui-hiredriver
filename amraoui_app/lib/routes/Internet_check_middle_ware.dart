// ignore_for_file: file_names
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:Vehiqqo/screens/error_screen/error_screen.dart';
import 'package:Vehiqqo/service/connectivity_service/connectivity_service.dart';

class InternetCheckMiddleWare extends GetMiddleware {
  final ConnectivityService connectivityService =
      Get.find<ConnectivityService>();

  @override
  RouteSettings? redirect(String? route) {
    if (connectivityService.connectionStatus.contains(
      ConnectivityResult.none,
    )) {
      return const RouteSettings(name: AppRoutes.errorScreen);
    }
    return super.redirect(route);
  }

  @override
  GetPage? onPageCalled(GetPage? page) {
    if (connectivityService.connectionStatus.contains(
      ConnectivityResult.none,
    )) {
      return GetPage(
        name: AppRoutes.errorScreen,
        page: () => const ErrorScreen(),
      );
    }
    return super.onPageCalled(page);
  }

  @override
  GetPageBuilder? onPageBuildStart(GetPageBuilder? page) {
    if (connectivityService.connectionStatus.contains(
      ConnectivityResult.none,
    )) {
      return () => const ErrorScreen();
    }
    return super.onPageBuildStart(page);
  }
}
