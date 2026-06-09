import 'dart:io';
import 'package:flutter/services.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';

void closeAppDialog() {
  Get.dialog(
    Dialog(
      backgroundColor: AppColors.white,
      child: Padding(
        padding: EdgeInsets.all(AppSize.width(value: 20)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Gap(height: 10),
            const AppText(
              data: "Close?",
              fontWeight: FontWeight.bold,
              fontSize: 20,
              color: AppColors.primary,
            ),
            const Gap(height: 30),
            const AppText(
              data: "Are you sure you want to close the App?",
              textAlign: TextAlign.center,
              height: 1.5,
            ),
            const Gap(height: 30),
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      Get.back();
                    },
                    child: Container(
                      margin: EdgeInsets.all(AppSize.width(value: 5)),
                      padding: EdgeInsets.all(AppSize.width(value: 5)),
                      width: Get.width,
                      height: AppSize.height(value: 50),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.primary),
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(
                          AppSize.width(value: 8.0),
                        ),
                      ),
                      child: const AppText(
                        data: "Cancel",
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.black,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      SystemNavigator.pop(); // For Android
                      exit(0); // For iOS and other platforms
                    },
                    child: Container(
                      margin: EdgeInsets.all(AppSize.width(value: 5)),
                      padding: EdgeInsets.all(AppSize.width(value: 5)),
                      width: Get.width,
                      height: AppSize.height(value: 50),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xffEE4747)),
                        color: const Color(0xffEE4747).withOpacity(.1),
                        borderRadius: BorderRadius.circular(
                          AppSize.width(value: 8.0),
                        ),
                      ),
                      child: const AppText(
                        data: "Yes",
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Color(0xffEE4747),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const Gap(height: 20),
          ],
        ),
      ),
    ),
  );
}
