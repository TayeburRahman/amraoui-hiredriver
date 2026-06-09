import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class VerifyCodeController extends GetxController {
  final _authRepo = AuthRepository();
  final List<TextEditingController> otpControllers =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> focusNodes = List.generate(6, (_) => FocusNode());

  late String email;

  @override
  void onInit() {
    super.onInit();
    email = AppStorage().getValue(StorageKey.pendingEmail)?.toString() ?? '';
  }

  String get otpCode => otpControllers.map((c) => c.text).join();

  Future<void> verify() async {
    if (otpCode.length != 6) {
      AppSnackBar.error('Please enter the 6-digit code');
      return;
    }

    appGlobalLoading();
    try {
      final res = await _authRepo.verifyResetOtp(email: email, code: otpCode);
      hideGlobalLoading();
      if (res?['success'] == true) {
        Get.toNamed(AppRoutes.createNewPassword);
      } else {
        AppSnackBar.error(res?['message']?.toString() ?? 'Invalid code');
      }
    } on DioException catch (e) {
      hideGlobalLoading();
      AppSnackBar.error(e.response?.data?['message']?.toString() ?? 'Verification failed');
    }
  }

  Future<void> resendCode() async {
    try {
      final res = await _authRepo.resendForgotOtp(email);
      AppSnackBar.success(res?['message']?.toString() ?? 'Code resent');
    } on DioException catch (e) {
      AppSnackBar.error(e.response?.data?['message']?.toString() ?? 'Failed to resend');
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
    super.onClose();
  }
}
