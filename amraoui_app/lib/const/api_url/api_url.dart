class AppApiUrl {
  // static const String domain = "http://10.10.28.71:5000"; // PC LAN IP — works for physical devices on the same network
  static const String domain =
      "http://127.0.0.1:5000"; // USB localhost (works with adb reverse)
  static const String baseUrl = "$domain/api/v1";
  static const String soketUrl = domain;

  // Auth Endpoints
  static const String signUpUrl = "/auth/signup";
  static const String signInUrl = "/auth/login";
  static const String activateAccountUrl = "/auth/activate";
  static const String resendActivationUrl = "/auth/resend-activation";
  static const String forgotPasswordUrl = "/auth/forgot-password";
  static const String verifyOtpUrl = "/auth/verify-otp";
  static const String resendForgotUrl = "/auth/resend-forgot-password";
  static const String resetPasswordUrl = "/auth/reset-password";
  static const String refreshTokenUrl = "/auth/refresh-token";
  static const String profileUrl = "/auth/profile";

  // Driver Endpoints
  static const String driverSubmitDocumentsUrl = "/drivers/my/documents";
  static const String driverDeleteDocumentUrl = "/drivers/my/documents/delete";
  static const String driverMyProfileUrl = "/drivers/my/profile";
  static const String driverUpdateProfileUrl = "/drivers/my/profile";
  static const String driverUpdateProfileImageUrl = "/drivers/my/profile-image";
  static const String driverUpdateSkillsUrl = "/drivers/my/skills";

  // Other endpoints (commented out in repositories but defining them to prevent errors if uncommented)
  static const String userMakeProductLikeUrl = "/user/like-product";
  static const String userGetClosetCollectionUrl = "/user/closet";
  static const String userGetClosetCollectionProductListUrl =
      "/user/closet-products/";
  static const String userSearchProductUrl = "/user/search-product";
  static const String userGetCartListUrl = "/user/cart";
  static const String userOrderHistoryListUrl = "/user/orders";
  static const String userExchangeOrderListUrl = "/user/exchange-orders";
  static const String userGetBannarListUrl = "/user/banners";
  static const String userOrderHistoryDetailsUrl = "/user/orders/";
  static const String getSellerProductDetailsUrl = "/seller/products/";
}
