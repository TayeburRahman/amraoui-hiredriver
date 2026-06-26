import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ActivateAccountController extends GetxController {
  final _authRepo = AuthRepository();
  final List<TextEditingController> otpControllers = List.generate(
    6,
    (_) => TextEditingController(),
  );
  final List<FocusNode> focusNodes = List.generate(6, (_) => FocusNode());

  late String email;
  final passwordController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    email = AppStorage().getValue(StorageKey.pendingEmail)?.toString() ?? '';
    if (email.isEmpty) {
      Get.offNamed(AppRoutes.signIn);
    }
  }

  String get otpCode => otpControllers.map((c) => c.text).join();

  Future<void> verify() async {
    if (otpCode.length != 6) {
      AppSnackBar.error('Please enter the 6-digit code');
      return;
    }

    appGlobalLoading();
    try {
      final res = await _authRepo.activateAccount(email: email, code: otpCode);
      hideGlobalLoading();

      if (res?['success'] != true) {
        AppSnackBar.error(
          res?['message']?.toString() ?? 'Invalid activation code',
        );
        return;
      }

      AppSnackBar.success('Email verified! Please log in to continue.');
      Get.offAllNamed(AppRoutes.signIn);
    } on DioException catch (e) {
      hideGlobalLoading(false);
      AppSnackBar.error(
        e.response?.data?['message']?.toString() ?? 'Verification failed',
      );
    }
  }

  Future<void> resendCode() async {
    try {
      final res = await _authRepo.resendActivation(email);
      AppSnackBar.success(res?['message']?.toString() ?? 'Code resent');
    } on DioException catch (e) {
      AppSnackBar.error(
        e.response?.data?['message']?.toString() ?? 'Failed to resend',
      );
    }
  }

  @override
  void onClose() {
    for (final c in otpControllers) {
      c.dispose();
    }
    for (final n in focusNodes) {
      n.dispose();
    }
    passwordController.dispose();
    super.onClose();
  }
}
