import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:country_picker/country_picker.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';

class SignUpController extends GetxController {
  final _authRepo = AuthRepository();

  final nameController = TextEditingController(
    text: kDebugMode ? 'John Doe' : '',
  );

  final emailController = TextEditingController(); // keep empty

  final phoneController = TextEditingController(
    text: kDebugMode ? '01712345678' : '',
  );

  final licenseController = TextEditingController(
    text: kDebugMode ? 'DL123456789' : '',
  );

  final vehicleTypeController = TextEditingController(
    text: kDebugMode ? 'Sedan' : '',
  );

  final vehiclePlateController = TextEditingController(
    text: kDebugMode ? 'DHAKA-METRO-1234' : '',
  );

  final passwordController = TextEditingController(
    text: kDebugMode ? 'Test@123' : '',
  );

  final confirmPasswordController = TextEditingController(
    text: kDebugMode ? 'Test@123' : '',
  );

  var isPasswordVisible = false.obs;
  var isConfirmPasswordVisible = false.obs;
  var agreeToTerms = false.obs;

  var selectedCountry = Country(
    phoneCode: '33',
    countryCode: 'FR',
    e164Sc: 0,
    geographic: true,
    level: 1,
    name: 'France',
    example: 'France',
    displayName: 'France',
    displayNameNoCountryCode: 'France',
    e164Key: '',
  ).obs;

  void updateCountry(Country country) => selectedCountry.value = country;
  void togglePasswordVisibility() =>
      isPasswordVisible.value = !isPasswordVisible.value;
  void toggleConfirmPasswordVisibility() =>
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
  void toggleTermsAgreement(bool? value) {
    if (value != null) agreeToTerms.value = value;
  }

  Future<void> createAccount() async {
    if (!agreeToTerms.value) {
      AppSnackBar.error('Please agree to Terms & Conditions');
      return;
    }
    if (passwordController.text != confirmPasswordController.text) {
      AppSnackBar.error('Passwords do not match');
      return;
    }
    if (passwordController.text.length < 6) {
      AppSnackBar.error('Password must be at least 6 characters');
      return;
    }

    appGlobalLoading();
    try {
      final phone =
          '+${selectedCountry.value.phoneCode} ${phoneController.text.trim()}';
      final res = await _authRepo.registerDriver(
        name: nameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text,
        confirmPassword: confirmPasswordController.text,
        phoneNumber: phone,
        licenseNumber: licenseController.text.trim(),
        vehicleType: vehicleTypeController.text.trim(),
        vehiclePlate: vehiclePlateController.text.trim(),
      );
      hideGlobalLoading();

      if (res?['success'] == true) {
        await AppStorage().setValue(
          StorageKey.pendingEmail,
          emailController.text.trim(),
        );
        AppSnackBar.success(
          res?['message']?.toString() ?? 'Account created. Check your email.',
        );
        Get.toNamed(AppRoutes.activateAccount);
      } else {
        AppSnackBar.error(res?['message']?.toString() ?? 'Registration failed');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionError) {
        AppSnackBar.error(
          'Cannot reach the server. Ensure your internet connection is active.',
        );
      } else {
        AppSnackBar.error(
          e.response?.data?['message']?.toString() ??
              e.message ??
              'Registration failed',
        );
      }
    } catch (e) {
      AppSnackBar.error('Registration failed');
    } finally {
      hideGlobalLoading();
    }
  }

  void navigateToLogin() => Get.back();

  @override
  void onClose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    licenseController.dispose();
    vehicleTypeController.dispose();
    vehiclePlateController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
