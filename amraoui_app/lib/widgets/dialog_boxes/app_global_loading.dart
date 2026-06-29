import 'package:flutter/material.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:get/get.dart';

final _globalLoader = AppGlobalLoading();

void appGlobalLoading() => _globalLoader.showLoader();

void hideGlobalLoading([bool shouldGoBack = true]) =>
    _globalLoader.hideLoader(shouldGoBack);

class AppGlobalLoading {
  bool _isLoaderOpen = false;

  void showLoader() {
    if (_isLoaderOpen) return;
    _isLoaderOpen = true;
    
    Future.microtask(() {
      if (!_isLoaderOpen) return; // Loading was hidden before dialog could open
      
      Get.dialog(
        Center(
          child: Container(
            width: AppSize.size.width * 0.5,
            height: AppSize.size.width * 0.4,
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(AppSize.width(value: 10)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                SizedBox(
                  height: AppSize.size.width * 0.15,
                  width: AppSize.size.width * 0.15,
                  child: const CircularProgressIndicator(
                    color: AppColors.primary,
                  ),
                ),
                AppText(data: "Loading....", fontSize: AppSize.width(value: 20)),
              ],
            ),
          ),
        ),
        barrierDismissible: false,
      ).then((_) {
        _isLoaderOpen = false;
      });
    });
  }

  void hideLoader([bool shouldGoBack = true]) {
    if (!shouldGoBack) {
      _isLoaderOpen = false;
      Get.closeAllDialogs();
      return;
    }

    _isLoaderOpen = false;

    // Check immediately
    if (Get.isDialogOpen ?? false) {
      Get.back();
      return;
    }

    // In case the dialog is still in the middle of opening/registering asynchronously,
    // schedule a close check shortly after.
    Future.delayed(const Duration(milliseconds: 100), () {
      if (Get.isDialogOpen ?? false) {
        Get.back();
      }
    });
  }
}
