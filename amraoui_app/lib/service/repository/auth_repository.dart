import 'dart:convert';
import 'package:amraoui_app/const/api_url/api_url.dart';
import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/service/api/non_auth_api.dart';
import 'package:amraoui_app/service/api/api.dart';
import 'package:amraoui_app/widgets/log_print/app_log.dart';
import 'package:dio/dio.dart';

class AuthRepository {
  final Dio _public = NonAuthApi().sendRequest;
  final Dio _auth = AppApi().sendRequest;

  Future<Map<String, dynamic>?> registerDriver({
    required String name,
    required String email,
    required String password,
    required String confirmPassword,
    required String phoneNumber,
    String? licenseNumber,
    String? vehicleType,
    String? vehiclePlate,
    String? companyName,
    String? taxNumber,
    String? profileImagePath,
    String? vehicleCarrierImagePath,
    String? dealerPlateImagePath,
    String? idDocumentFrontImagePath,
    String? idDocumentBackImagePath,
    String? driverLicenseFrontImagePath,
    String? driverLicenseBackImagePath,
  }) async {
    try {
      final Map<String, dynamic> jsonData = {
        'name': name,
        'email': email,
        'password': password,
        'confirmPassword': confirmPassword,
        'phone_number': phoneNumber,
        'role': 'DRIVER',
        if (licenseNumber != null && licenseNumber.isNotEmpty)
          'license_number': licenseNumber,
        if (vehicleType != null && vehicleType.isNotEmpty)
          'vehicle_type': vehicleType,
        if (vehiclePlate != null && vehiclePlate.isNotEmpty)
          'vehicle_plate': vehiclePlate,
        if (companyName != null && companyName.isNotEmpty)
          'company_name': companyName,
        if (taxNumber != null && taxNumber.isNotEmpty)
          'tax_number': taxNumber,
      };

      final formData = FormData.fromMap({
        'data': jsonEncode(jsonData),
      });

      if (profileImagePath != null && profileImagePath.isNotEmpty) {
        formData.files.add(
          MapEntry(
            'profile_image',
            await MultipartFile.fromFile(profileImagePath),
          ),
        );
      }

      if (vehicleCarrierImagePath != null && vehicleCarrierImagePath.isNotEmpty) {
        formData.files.add(
          MapEntry(
            'vehicle_carrier_image',
            await MultipartFile.fromFile(vehicleCarrierImagePath),
          ),
        );
      }

      if (dealerPlateImagePath != null && dealerPlateImagePath.isNotEmpty) {
        formData.files.add(
          MapEntry(
            'dealer_plate_image',
            await MultipartFile.fromFile(dealerPlateImagePath),
          ),
        );
      }

      if (idDocumentFrontImagePath != null && idDocumentFrontImagePath.isNotEmpty) {
        formData.files.add(
          MapEntry(
            'id_document_front',
            await MultipartFile.fromFile(idDocumentFrontImagePath),
          ),
        );
      }

      if (idDocumentBackImagePath != null && idDocumentBackImagePath.isNotEmpty) {
        formData.files.add(
          MapEntry(
            'id_document_back',
            await MultipartFile.fromFile(idDocumentBackImagePath),
          ),
        );
      }

      if (driverLicenseFrontImagePath != null && driverLicenseFrontImagePath.isNotEmpty) {
        formData.files.add(
          MapEntry(
            'license_document_front',
            await MultipartFile.fromFile(driverLicenseFrontImagePath),
          ),
        );
      }

      if (driverLicenseBackImagePath != null && driverLicenseBackImagePath.isNotEmpty) {
        formData.files.add(
          MapEntry(
            'license_document_back',
            await MultipartFile.fromFile(driverLicenseBackImagePath),
          ),
        );
      }

      final res = await _public.post(
        AppApiUrl.signUpUrl,
        data: formData,
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      appLog(
        'registerDriver error: type=${e.type} message=${e.message} data=${e.response?.data}',
      );
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> activateAccount({
    required String email,
    required String code,
  }) async {
    try {
      final res = await _public.post(
        AppApiUrl.activateAccountUrl,
        data: {
          'userEmail': email,
          'activation_code': code,
        },
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      appLog('activateAccount error: ${e.response?.data}');
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> resendActivation(String email) async {
    try {
      final res = await _public.post(
        AppApiUrl.resendActivationUrl,
        data: {'email': email},
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      appLog('resendActivation error: ${e.response?.data}');
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> login({
    required String email,
    required String password,
  }) async {
    try {
      final res = await _public.post(
        AppApiUrl.signInUrl,
        data: {'email': email, 'password': password},
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      appLog('login error: ${e.response?.data}');
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> forgotPassword(String email) async {
    try {
      final res = await _public.post(
        AppApiUrl.forgotPasswordUrl,
        data: {'email': email},
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> verifyResetOtp({
    required String email,
    required String code,
  }) async {
    try {
      final res = await _public.post(
        AppApiUrl.verifyOtpUrl,
        data: {'email': email, 'code': code},
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> resendForgotOtp(String email) async {
    try {
      final res = await _public.post(
        AppApiUrl.resendForgotUrl,
        data: {'email': email},
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> resetPassword({
    required String email,
    required String newPassword,
    required String confirmPassword,
  }) async {
    try {
      final res = await _public.post(
        '${AppApiUrl.resetPasswordUrl}?email=$email',
        data: {
          'newPassword': newPassword,
          'confirmPassword': confirmPassword,
        },
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      rethrow;
    }
  }

  Future<DriverModel?> getProfile() async {
    try {
      final res = await _auth.get(AppApiUrl.profileUrl);
      final data = res.data as Map<String, dynamic>?;
      if (data?['success'] == true && data?['data'] != null) {
        return DriverModel.fromJson(data!['data'] as Map<String, dynamic>);
      }
      return null;
    } on DioException catch (e) {
      appLog('getProfile error: ${e.response?.data}');
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> changePassword({
    required String oldPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    try {
      final res = await _auth.patch(
        AppApiUrl.changePasswordUrl,
        data: {
          'oldPassword': oldPassword,
          'newPassword': newPassword,
          'confirmPassword': confirmPassword,
        },
      );
      return res.data as Map<String, dynamic>?;
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message;
      throw Exception(msg);
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}
