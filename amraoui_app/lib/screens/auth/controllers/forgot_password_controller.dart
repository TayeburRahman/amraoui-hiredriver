import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ForgotPasswordController extends GetxController {
  final _authRepo = AuthRepository();
  final contactController = TextEditingController();

  Future<void> sendCode() async {
    final email = contactController.text.trim();
    if (email.isEmpty) {
      AppSnackBar.error('Email is required');
      return;
    }

    appGlobalLoading();
    try {
      final res = await _authRepo.forgotPassword(email);
      hideGlobalLoading();
      if (res?['success'] == true) {
        await AppStorage().setValue(StorageKey.pendingEmail, email);
        await AppStorage().setValue(StorageKey.verifyMode, 'reset');
        AppSnackBar.success(res?['message']?.toString() ?? 'Code sent to your email');
        Get.toNamed(AppRoutes.verifyCode);
      } else {
        AppSnackBar.error(res?['message']?.toString() ?? 'Failed to send code');
      }
    } on DioException catch (e) {
      hideGlobalLoading();
      AppSnackBar.error(e.response?.data?['message']?.toString() ?? 'Failed to send code');
    }
  }

  void backToLogin() => Get.back();

  @override
  void onClose() {
    contactController.dispose();
    super.onClose();
  }
}
