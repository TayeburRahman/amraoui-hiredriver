import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/utils/auth_navigation.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
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

  @override
  void onInit() {
    super.onInit();
    _loadSavedCredentials();
  }

  void _loadSavedCredentials() {
    final isRemembered = AppStorage().getValue(StorageKey.rememberMe) ?? false;
    if (isRemembered == true) {
      final savedEmail = AppStorage().getValue(StorageKey.savedEmail);
      final savedPassword = AppStorage().getValue(StorageKey.savedPassword);
      emailController.text = savedEmail?.toString() ?? '';
      passwordController.text = savedPassword?.toString() ?? '';
      rememberMe.value = true;
    }
  }

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

  var isLoading = false.obs;

  Future<void> login() async {
    if (emailController.text.trim().isEmpty || passwordController.text.isEmpty) {
      AppSnackBar.error('Email and password are required');
      return;
    }

    if (isLoading.value) return;
    isLoading.value = true;

    try {
      final res = await _authRepo.login(
        email: emailController.text.trim().toLowerCase(),
        password: passwordController.text,
      );
      isLoading.value = false;

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

      if (rememberMe.value) {
        AppStorage().setValue(StorageKey.rememberMe, true);
        AppStorage().setValue(StorageKey.savedEmail, emailController.text.trim().toLowerCase());
        AppStorage().setValue(StorageKey.savedPassword, passwordController.text);
      } else {
        AppStorage().setValue(StorageKey.rememberMe, false);
        AppStorage().removeValue(StorageKey.savedEmail);
        AppStorage().removeValue(StorageKey.savedPassword);
      }

      AuthNavigation.routeDriver(driver);
    } on DioException catch (e) {
      isLoading.value = false;
      String errorMsg = 'Login failed';
      if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
        errorMsg = 'Connection timed out. Server might be offline.';
      } else if (e.response?.data is Map<String, dynamic>) {
        errorMsg = e.response?.data['message']?.toString() ?? 'Login failed';
      }
      AppSnackBar.error(errorMsg);
    } catch (e) {
      isLoading.value = false;
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
