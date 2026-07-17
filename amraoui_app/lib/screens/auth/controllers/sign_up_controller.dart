import 'package:amraoui_app/const/api_url/api_url.dart';
import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:country_picker/country_picker.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:image_picker/image_picker.dart';

class SignUpController extends GetxController {
  final _authRepo = AuthRepository();
  final _picker = ImagePicker();

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

  final vehicleTypeController = TextEditingController(); // Or remove, but keeping for compatibility if needed.
  final vehiclePlateController = TextEditingController();

  final companyNameController = TextEditingController(
    text: kDebugMode ? 'Test Company' : '',
  );

  final taxNumberController = TextEditingController(
    text: kDebugMode ? 'TAX123456' : '',
  );

  var isVehicleCarrier = false.obs;
  var isDealerPlate = false.obs;
  var profileImagePath = ''.obs;
  var vehicleCarrierImagePath = ''.obs;
  var dealerPlateImagePath = ''.obs;
  var idDocumentFrontImagePath = ''.obs;
  var idDocumentBackImagePath = ''.obs;
  var driverLicenseFrontImagePath = ''.obs;
  var driverLicenseBackImagePath = ''.obs;

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

  Future<void> pickVehicleCarrierImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      vehicleCarrierImagePath.value = pickedFile.path;
    }
  }

  Future<void> pickProfileImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      profileImagePath.value = pickedFile.path;
    }
  }

  Future<void> pickDealerPlateImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      dealerPlateImagePath.value = pickedFile.path;
    }
  }

  Future<void> pickIdDocumentFront() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      idDocumentFrontImagePath.value = pickedFile.path;
    }
  }

  Future<void> pickIdDocumentBack() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      idDocumentBackImagePath.value = pickedFile.path;
    }
  }

  Future<void> pickDriverLicenseFront() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      driverLicenseFrontImagePath.value = pickedFile.path;
    }
  }

  Future<void> pickDriverLicenseBack() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      driverLicenseBackImagePath.value = pickedFile.path;
    }
  }

  void updateCountry(Country country) => selectedCountry.value = country;
  void togglePasswordVisibility() =>
      isPasswordVisible.value = !isPasswordVisible.value;
  void toggleConfirmPasswordVisibility() =>
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
  void toggleTermsAgreement(bool? value) {
    if (value != null) agreeToTerms.value = value;
  }

  void showTermsAndConditions() {
    Get.dialog(
      Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Container(
          padding: const EdgeInsets.all(24),
          constraints: BoxConstraints(maxHeight: Get.height * 0.7),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Terms & Conditions',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 16),
              Flexible(
                child: FutureBuilder(
                  future: Dio().get(AppApiUrl.baseUrl + AppApiUrl.settingsUrl),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return const Text(
                        'Failed to load Terms & Conditions',
                        style: TextStyle(color: Colors.red),
                      );
                    } else {
                      final data = (snapshot.data as dynamic).data['data'];
                      final terms = data?['termsCondition'] ?? 'No Terms & Conditions available at the moment.';
                      return SingleChildScrollView(
                        child: Text(
                          terms.toString(),
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF334155),
                          ),
                        ),
                      );
                    }
                  },
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Get.back(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text(
                    'Close',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
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
        vehicleType: isVehicleCarrier.value ? 'Vehicle Carrier' : 'Standard',
        vehiclePlate: isDealerPlate.value ? 'Dealer Plate' : 'Standard Plate',
        companyName: companyNameController.text.trim(),
        taxNumber: taxNumberController.text.trim(),
        profileImagePath: profileImagePath.value.isNotEmpty ? profileImagePath.value : null,
        vehicleCarrierImagePath: isVehicleCarrier.value ? vehicleCarrierImagePath.value : null,
        dealerPlateImagePath: isDealerPlate.value ? dealerPlateImagePath.value : null,
        idDocumentFrontImagePath: idDocumentFrontImagePath.value.isNotEmpty ? idDocumentFrontImagePath.value : null,
        idDocumentBackImagePath: idDocumentBackImagePath.value.isNotEmpty ? idDocumentBackImagePath.value : null,
        driverLicenseFrontImagePath: driverLicenseFrontImagePath.value.isNotEmpty ? driverLicenseFrontImagePath.value : null,
        driverLicenseBackImagePath: driverLicenseBackImagePath.value.isNotEmpty ? driverLicenseBackImagePath.value : null,
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
    companyNameController.dispose();
    taxNumberController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
