import 'package:Vehiqqo/const/storage/get_storage.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class OnboardController extends GetxController {
  final PageController pageController = PageController();
  var currentPage = 0.obs;

  void onPageChanged(int index) {
    currentPage.value = index;
  }

  void next() {
    if (currentPage.value < 2) {
      pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeIn,
      );
    } else {
      getStarted();
    }
  }

  void skip() {
    getStarted();
  }

  void getStarted() {
    AppStorage().setOnBoardValue('true');
    Get.offAllNamed(AppRoutes.signIn);
  }

  @override
  void onClose() {
    pageController.dispose();
    super.onClose();
  }
}
