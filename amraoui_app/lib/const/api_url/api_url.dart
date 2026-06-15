import 'package:flutter/foundation.dart';

class AppApiUrl {
  AppApiUrl._();

  static String domain = _domain();
  static String baseUrl = "${_domain()}/api/v1";

  // Auth
  static const String signUpUrl = "/auth/register";
  static const String signInUrl = "/auth/login";
  static const String activateAccountUrl = "/auth/activate-user";
  static const String resendActivationUrl = "/auth/active-resend";
  static const String forgotPasswordUrl = "/auth/forgot-password";
  static const String resendForgotUrl = "/auth/resend-forgot";
  static const String verifyOtpUrl = "/auth/verify-otp";
  static const String resetPasswordUrl = "/auth/reset-password";
  static const String profileUrl = "/auth/profile";
  static const String editProfileUrl = "/auth/edit-profile";
  static const String changePasswordUrl = "/auth/change-password";
  static const String refreshTokenUrl = "/auth/refresh-token";

  // Driver
  static const String driverMyProfileUrl = "/drivers/my/profile";
  static const String driverSubmitDocumentsUrl = "/drivers/my/documents";
  static const String driverUpdateLocationUrl = "/drivers/my/location";

  // Missions
  static const String missionsUrl = "/requests/missions";
  static const String submitDriverQuoteUrl = "/requests"; // e.g., /requests/{id}/driver-quote
}

String _domain() {
  // Override: flutter run --dart-define=API_BASE=http://10.10.20.50:5000
  const override = String.fromEnvironment('API_BASE');
  if (override.isNotEmpty) return override;

  if (kIsWeb) {
    // Flutter Web runs in the browser — use localhost (same machine as backend)
    return 'http://localhost:5000';
  }

  // Use the LAN IP for all mobile devices (emulator or physical device)
  return 'http://10.10.28.71:5000';
}
