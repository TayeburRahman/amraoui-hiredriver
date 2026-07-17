import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/screens/splash_screen/controllers/splash_screen_controller.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    AppSize.size = size;
    return GetBuilder(
      init: SplashScreenController(),
      builder: (controller) {
        return SafeArea(
          top: false,
          // AnnotatedRegion(
          // value: const SystemUiOverlayStyle(
          //   systemNavigationBarIconBrightness: Brightness.dark,
          //   systemNavigationBarColor: AppColors.primary,
          // ),
          child: SafeArea(
            child: Scaffold(
              drawerScrimColor: AppColors.white,
              backgroundColor: AppColors.white,
              body: Container(
                height: AppSize.size.height,
                width: AppSize.size.width,
                alignment: Alignment.center,
                decoration: const BoxDecoration(color: AppColors.white),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.flutter_dash,
                        size: AppSize.height(value: 120),
                      ),
                      Gap(height: 20),
                      AppText(data: "Splash Screen", fontSize: 20),
                      // AppImage(
                      //   height: AppSize.height(value: 120),
                      //   // path: AssetsImagesPath.splashLogo,
                      // ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
