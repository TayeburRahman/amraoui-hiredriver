import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/routes/app_routes_file.dart';
import 'package:amraoui_app/translation/app_translation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MainAppEntry extends StatelessWidget {
  const MainAppEntry({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      defaultTransition: Transition.noTransition,
      debugShowCheckedModeBanner: false,
      translations: AppTranslation(),
      locale: const Locale('en', 'US'),
      fallbackLocale: const Locale('en', 'US'),
      // theme: appTheme,
      // themeMode: ThemeMode.dark,
      // theme: lightTheme,
      // themeMode: ThemeController().theme,
      // darkTheme: darkTheme,
      themeMode: ThemeMode.light,
      initialRoute: AppRoutes.initial,
      getPages: appRoutesFile,
    );
  }
}
