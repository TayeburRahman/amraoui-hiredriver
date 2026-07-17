import 'dart:developer';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/service/connectivity_service/connectivity_service.dart';

class ErrorScreenController extends GetxController {
  RxString errorMessage = "".obs;
  RxBool isInternetProblem = true.obs;
  final ConnectivityService connectivityService =
      Get.isRegistered<ConnectivityService>()
      ? Get.find<ConnectivityService>()
      : Get.put(ConnectivityService());

  void initialDataCall() {
    try {
      if (connectivityService.connectionStatus.contains(
        ConnectivityResult.none,
      )) {
        errorMessage.value = "No Internet Connection";
        isInternetProblem.value = true;
      } else {
        errorMessage.value = "Error Form Occurs";
        isInternetProblem.value = false;
      }
    } catch (e) {
      log("error form error screen : $e");
    }
  }

  @override
  void onInit() {
    initialDataCall();
    super.onInit();
  }
}
