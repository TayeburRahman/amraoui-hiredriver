import 'dart:ui';

import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';

void themeChangeDialogBox(String themeString) {
  Get.dialog(
    barrierColor: Colors.black.withOpacity(.9),
    BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
      child: Dialog(
        backgroundColor: AppColors.white,
        child: Padding(
          padding: EdgeInsets.all(AppSize.width(value: 0)),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Gap(height: 50),
              const Icon(Icons.light_mode_outlined, size: 50),
              const Gap(height: 20),
              AppText(
                data: themeString,
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: AppColors.primary,
              ),

              const Gap(height: 50),
              // Row(
              //   children: [
              //     Expanded(
              //       child: GestureDetector(
              //         onTap: () {
              //           Get.closeAllDialogs();
              //         },
              //         child: Container(
              //           margin: EdgeInsets.all(AppSize.width(value: 5)),
              //           padding: EdgeInsets.all(AppSize.width(value: 5)),
              //           width: Get.width,
              //           height: AppSize.height(value: 50),
              //           alignment: Alignment.center,
              //           decoration: BoxDecoration(
              //               border: Border.all(
              //                 color: AppColors.primary,
              //               ),
              //               color: AppColors.white,
              //               borderRadius:
              //                   BorderRadius.circular(AppSize.width(value: 8.0))),
              //           child: const AppText(
              //             data: "Cancel",
              //             fontSize: 18,
              //             fontWeight: FontWeight.w700,
              //             color: AppColors.black,
              //           ),
              //         ),
              //       ),
              //     ),
              //     Expanded(
              //       child: GestureDetector(
              //         onTap: () {
              //           // Get.closeAllDialogs();
              //           // AppStorage().removeValue(StorageKey.loginValue);

              //           Get.offAllNamed(AppRoutes.signIn);
              //         },
              //         child: Container(
              //           margin: EdgeInsets.all(AppSize.width(value: 5)),
              //           padding: EdgeInsets.all(AppSize.width(value: 5)),
              //           width: Get.width,
              //           height: AppSize.height(value: 50),
              //           alignment: Alignment.center,
              //           decoration: BoxDecoration(
              //               border: Border.all(
              //                 color: const Color(0xffEE4747),
              //               ),
              //               color: const Color(0xffEE4747).withOpacity(.1),
              //               borderRadius: BorderRadius.circular(
              //                 AppSize.width(value: 8.0),
              //               )),
              //           child: const AppText(
              //             data: "LogOut",
              //             fontSize: 18,
              //             fontWeight: FontWeight.w700,
              //             color: const Color(0xffEE4747),
              //           ),
              //         ),
              //       ),
              //     ),
              //   ],
              // ),
              const Gap(height: 20),
            ],
          ),
        ),
      ),
    ),
  );
}
