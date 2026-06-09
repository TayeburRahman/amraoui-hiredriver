import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CreateNewPasswordController extends GetxController {
  final _authRepo = AuthRepository();
  final newPasswordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  var isNewPasswordVisible = false.obs;
  var isConfirmPasswordVisible = false.obs;

  void toggleNewPasswordVisibility() =>
      isNewPasswordVisible.value = !isNewPasswordVisible.value;
  void toggleConfirmPasswordVisibility() =>
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;

  Future<void> resetPassword() async {
    if (newPasswordController.text != confirmPasswordController.text) {
      AppSnackBar.error('Passwords do not match');
      return;
    }
    if (newPasswordController.text.length < 6) {
      AppSnackBar.error('Password must be at least 6 characters');
      return;
    }

    final email = AppStorage().getValue(StorageKey.pendingEmail)?.toString() ?? '';
    if (email.isEmpty) {
      AppSnackBar.error('Session expired. Please try again.');
      Get.offAllNamed(AppRoutes.forgotPassword);
      return;
    }

    appGlobalLoading();
    try {
      final res = await _authRepo.resetPassword(
        email: email,
        newPassword: newPasswordController.text,
        confirmPassword: confirmPasswordController.text,
      );
      hideGlobalLoading();
      if (res?['success'] == true) {
        AppSnackBar.success('Password reset successfully');
        Get.offAllNamed(AppRoutes.signIn);
      } else {
        AppSnackBar.error(res?['message']?.toString() ?? 'Reset failed');
      }
    } on DioException catch (e) {
      hideGlobalLoading();
      AppSnackBar.error(e.response?.data?['message']?.toString() ?? 'Reset failed');
    }
  }

  @override
  void onClose() {
    newPasswordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
