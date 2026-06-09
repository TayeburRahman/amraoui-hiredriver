// import 'package:get_storage/get_storage.dart';

// class LocalData {
//   final box = GetStorage();
//   final String userData = "userData";
//   getThemeData() async {
//     return await box.read(userData) ?? false;
//   }

//   setThemeData(bool value) async {
//     await box.write(userData, value);
//   }
// }

// import 'package:flutter/material.dart';

// import 'package:get/get.dart';
 
// class ThemeController {

//   var isDark = false.obs;
 
//   ThemeMode get theme => isDark.value ? ThemeMode.dark : ThemeMode.light;
 
//   void toggleTheme() {

//     // isDark.value = !isDark.value;

//     Get.changeThemeMode(theme);

//   }

// }

 
