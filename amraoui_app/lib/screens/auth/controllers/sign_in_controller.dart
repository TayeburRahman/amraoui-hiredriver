import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/utils/auth_navigation.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SignInController extends GetxController {
  final _authRepo = AuthRepository();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  var isPasswordVisible = false.obs;
  var rememberMe = false.obs;
  var currentLanguage = 'EN'.obs;

  void changeLanguage(String langCode) {
    currentLanguage.value = langCode;
    if (langCode == 'DU') {
      Get.updateLocale(const Locale('nl', 'NL'));
    } else if (langCode == 'FR') {
      Get.updateLocale(const Locale('fr', 'FR'));
    } else {
      Get.updateLocale(const Locale('en', 'US'));
    }
  }

  void togglePasswordVisibility() => isPasswordVisible.value = !isPasswordVisible.value;
  void toggleRememberMe(bool? value) {
    if (value != null) rememberMe.value = value;
  }

  Future<void> login() async {
    if (emailController.text.trim().isEmpty || passwordController.text.isEmpty) {
      AppSnackBar.error('Email and password are required');
      return;
    }

    appGlobalLoading();
    try {
      final res = await _authRepo.login(
        email: emailController.text.trim().toLowerCase(),
        password: passwordController.text,
      );
      hideGlobalLoading();

      if (res?['success'] != true || res?['data'] == null) {
        AppSnackBar.error(res?['message']?.toString() ?? 'Login failed');
        return;
      }

      final data = res!['data'] as Map<String, dynamic>;
      final role = data['user']?['authId']?['role'] ?? data['user']?['role'];
      if (role != null && role != 'DRIVER') {
        AppSnackBar.error('Only driver accounts can log in to this app');
        return;
      }

      final driver = DriverModel.fromJson(data['user'] as Map<String, dynamic>);
      await AuthNavigation.saveSession(
        accessToken: data['accessToken'].toString(),
        refreshToken: data['refreshToken'].toString(),
        driver: driver,
      );

      AuthNavigation.routeDriver(driver);
    } on DioException catch (e) {
      hideGlobalLoading();
      String errorMsg = 'Login failed';
      if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
        errorMsg = 'Connection timed out. Server might be offline.';
      } else if (e.response?.data is Map<String, dynamic>) {
        errorMsg = e.response?.data['message']?.toString() ?? 'Login failed';
      }
      AppSnackBar.error(errorMsg);
    } catch (e) {
      hideGlobalLoading();
      AppSnackBar.error('Login failed');
    }
  }

  void navigateToSignUp() => Get.toNamed(AppRoutes.signUp);
  void forgotPassword() => Get.toNamed(AppRoutes.forgotPassword);

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
