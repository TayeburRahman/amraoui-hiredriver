import 'dart:async';
import 'package:Vehiqqo/const/storage/get_storage.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:Vehiqqo/service/repository/auth_repository.dart';
import 'package:Vehiqqo/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:Vehiqqo/widgets/dialog_boxes/app_global_loading.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class VerifyCodeController extends GetxController {
  final _authRepo = AuthRepository();
  final List<TextEditingController> otpControllers = List.generate(
    6,
    (_) => TextEditingController(),
  );
  final List<FocusNode> focusNodes = List.generate(6, (_) => FocusNode());

  late String email;
  final RxInt remainingSeconds = 120.obs;
  final RxBool isLoading = false.obs;
  Timer? _timer;

  @override
  void onInit() {
    super.onInit();
    email = AppStorage().getValue(StorageKey.pendingEmail)?.toString() ?? '';
    startTimer();
  }

  void startTimer() {
    _timer?.cancel();
    remainingSeconds.value = 120;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
      } else {
        timer.cancel();
      }
    });
  }

  String get formattedTime {
    int minutes = remainingSeconds.value ~/ 60;
    int seconds = remainingSeconds.value % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  String get otpCode => otpControllers.map((c) => c.text).join();

  Future<void> verify() async {
    if (otpCode.length != 6) {
      AppSnackBar.error('Please enter the 6-digit code');
      return;
    }

    isLoading.value = true;
    try {
      final res = await _authRepo.verifyResetOtp(email: email, code: otpCode);
      if (res?['success'] == true) {
        Get.toNamed(AppRoutes.createNewPassword);
      } else {
        AppSnackBar.error(res?['message']?.toString() ?? 'Invalid code');
      }
    } on DioException catch (e) {
      AppSnackBar.error(
        e.response?.data?['message']?.toString() ?? 'Verification failed',
      );
    } catch (e) {
      AppSnackBar.error('Verification failed');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> resendCode() async {
    try {
      final res = await _authRepo.resendForgotOtp(email);
      AppSnackBar.success(res?['message']?.toString() ?? 'Code resent');
      startTimer();
    } on DioException catch (e) {
      AppSnackBar.error(
        e.response?.data?['message']?.toString() ?? 'Failed to resend',
      );
    }
  }

  @override
  void onClose() {
    _timer?.cancel();
    for (final c in otpControllers) {
      c.dispose();
    }
    for (final n in focusNodes) {
      n.dispose();
    }
    super.onClose();
  }
}
