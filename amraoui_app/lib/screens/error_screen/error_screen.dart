import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/screens/error_screen/controllers/error_screen_controller.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';

class ErrorScreen extends StatelessWidget {
  const ErrorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    AppSize.size = size;
    return GetBuilder(
      init: ErrorScreenController(),
      builder: (controller) {
        return Scaffold(
          backgroundColor: Colors.white,
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Obx(
                  () => Icon(
                    controller.isInternetProblem.value
                        ? Icons.signal_wifi_off_outlined
                        : Icons.error_outline_rounded,
                    color: AppColors.primary,
                    size: AppSize.width(value: 100),
                  ),
                ),
                const Gap(height: 20),
                Obx(
                  () => AppText(
                    data: controller.errorMessage.value,
                    color: AppColors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                Obx(
                  () => controller.isInternetProblem.value
                      ? Padding(
                          padding: EdgeInsets.all(AppSize.width(value: 10)),
                          child: const AppText(
                            data: "Check Your Internet Connection",
                            color: AppColors.black,
                            fontSize: 15,
                          ),
                        )
                      : const SizedBox(),
                ),
                const Gap(height: 30),
                GestureDetector(
                  onTap: () async {
                    await Get.offAllNamed(AppRoutes.initial);
                  },
                  child: const AppText(
                    data: "Try Again",
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
