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
  }) async {
    try {
      final res = await _public.post(
        AppApiUrl.signUpUrl,
        data: {
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
        },
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
