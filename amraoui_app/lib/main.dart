import 'package:amraoui_app/main_app_entry.dart';
import 'package:amraoui_app/service/connectivity_service/connectivity_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(statusBarColor: Colors.transparent),
  );
  await GetStorage.init();
  Get.put(ConnectivityService());
  SystemChrome.setPreferredOrientations([
    // DeviceOrientation.portraitDown, // Lock to portrait mode
    DeviceOrientation.portraitUp, // Lock to portrait mode
  ]).then((_) {
    runApp(const MainAppEntry());
  });
}
