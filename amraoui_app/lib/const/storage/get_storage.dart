import 'package:Vehiqqo/enum_types/app_user_type.dart';
import 'package:get_storage/get_storage.dart';

class StorageKey {
  StorageKey._();
  static const String token = "token";
  static const String refreshToken = "refreshToken";
  static const String onBoardValue = "onBoard";
  static const String likeValue = "likeValue";
  static const String dislikeValue = "dislikeValue";
  static const String loginValue = "loginValue";
  static const String setLoginUserRole = "setLoginUserRole";
  static const String themeData = "themeData";
  static const String role = "role";
  static const String userInfo = "userInfo";
  static const String pendingEmail = "pendingEmail";
  static const String verifyMode = "verifyMode";
  static const String savedEmail = "savedEmail";
  static const String savedPassword = "savedPassword";
  static const String rememberMe = "rememberMe";
}

class AppStorage {
  ////////////// storage initial
  GetStorage box = GetStorage();

  String? getThemeData() {
    return box.read(StorageKey.themeData);
  }

  Future<void> setThemeData(String value) async {
    await box.write(StorageKey.themeData, value);
  }

  //////////////////// Token

  Future<void> setToken(String value) async {
    await box.write(StorageKey.token, value);
  }

  String getToken() {
    return box.read(StorageKey.token) ?? "";
  }

  Future<void> setRefreshToken(String value) async {
    await box.write(StorageKey.refreshToken, value);
  }

  Future<void> setLoginValue(String value) async {
    await box.write(StorageKey.loginValue, value);
  }

  Future<void> setLoginUserRole(String value) async {
    await box.write(StorageKey.setLoginUserRole, value);
  }

  String? getRefreshToken() {
    return box.read(StorageKey.refreshToken);
  }

  Future<void> setOnBoardValue(String value) async {
    await box.write(StorageKey.onBoardValue, value);
  }

  Future<void> setLikeValue(String value) async {
    await box.write(StorageKey.likeValue, value);
  }

  Future<void> setDislikeValue(String value) async {
    await box.write(StorageKey.dislikeValue, value);
  }

  dynamic getValue(String value) {
    return box.read(value);
  }

  Future<void> setValue(String key, dynamic value) async {
    await box.write(key, value);
  }

  Future<void> removeValue(String value) async {
    await box.remove(value);
  }

  ///////////
  UserType getAppRole() {
    var response = box.read(StorageKey.role) ?? "User";
    return response.toString().toLowerCase() == "User".toLowerCase()
        ? UserType.user
        : UserType.serviceProvider;
  }

  Future<void> setAppRole(String value) async {
    await box.write(StorageKey.role, value);
  }

  Future<void> storageAllClear() async {
    await removeValue(StorageKey.token);
    await removeValue(StorageKey.refreshToken);
    await removeValue(StorageKey.userInfo);
    await removeValue(StorageKey.role);
  }
}
