import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:get/get.dart';

class AppUiLoader {
  void show({String title = "Loading..."}) {
    Get.dialog(
      Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {},
          child: Center(
            child: Container(
              padding: EdgeInsets.symmetric(
                vertical: AppSize.width(value: 20),
                horizontal: AppSize.width(value: 30),
              ),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(AppSize.width(value: 10)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CupertinoActivityIndicator(
                    color: AppColors.primary,
                    radius: AppSize.size.width * 0.08,
                  ),
                  Gap(height: 10),
                  AppText(data: title, color: AppColors.primary),
                ],
              ),
            ),
          ),
        ),
      ),
      barrierDismissible: false,
    );
  }

  void hide() {
    Get.back();
  }
}
