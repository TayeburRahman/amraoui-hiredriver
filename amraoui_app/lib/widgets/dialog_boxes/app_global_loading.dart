import 'package:flutter/material.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:get/get.dart';

final _globalLoader = AppGlobalLoading();

void appGlobalLoading() => _globalLoader.showLoader();
void hideGlobalLoading() => _globalLoader.hideLoader();

class AppGlobalLoading {
  void showLoader() {
    Get.dialog(
        Center(
          child: Container(
            width: AppSize.size.width * 0.5,
            height: AppSize.size.width * 0.4,
            decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(AppSize.width(value: 10))),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                SizedBox(
                    height: AppSize.size.width * 0.15,
                    width: AppSize.size.width * 0.15,
                    child: const CircularProgressIndicator(
                      color: AppColors.primary,
                    )),
                AppText(
                  data: "Loading....",
                  fontSize: AppSize.width(value: 20),
                )
              ],
            ),
          ),
        ),
        barrierDismissible: false);
  }

  void hideLoader() {
    if (Get.isDialogOpen ?? false) {
      Get.back();
    }
  }
}
