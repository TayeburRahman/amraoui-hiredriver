import 'package:Vehiqqo/const/storage/get_storage.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:Vehiqqo/service/repository/auth_repository.dart';
import 'package:Vehiqqo/utils/auth_navigation.dart';
import 'package:Vehiqqo/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:Vehiqqo/widgets/dialog_boxes/app_global_loading.dart';
import 'package:Vehiqqo/widgets/dialog_boxes/log_out_dailog.dart';
import 'package:get/get.dart';

class PendingApprovalController extends GetxController {
  final _authRepo = AuthRepository();
  var message = 'Your documents are under admin review.'.obs;
  var isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    final driver = AuthNavigation.getStoredDriver();
    if (driver?.declineReason != null && driver!.declineReason!.isNotEmpty) {
      message.value = driver.declineReason!;
    }
  }

  Future<void> checkStatus() async {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      final driver = await _authRepo.getProfile();
      if (driver == null) return;

      final access = AppStorage().getToken();
      final refresh = AppStorage().getRefreshToken() ?? '';
      await AuthNavigation.saveSession(
        accessToken: access,
        refreshToken: refresh,
        driver: driver,
      );

      if (driver.isApproved) {
        AppSnackBar.success('Your account has been approved!');
        Get.offAllNamed(AppRoutes.navigationScreen);
      } else if (driver.isDeclined) {
        AppSnackBar.error('Your application was declined');
        message.value = driver.declineReason ?? 'Application declined';
      } else {
        final pendingMsg =
            'Admin approval has not been completed yet. You will be notified via email once the admin reviews your application.';
        message.value = pendingMsg;
        AppSnackBar.message(pendingMsg);
      }
    } catch (e) {
      AppSnackBar.error('Could not refresh status');
    } finally {
      isLoading.value = false;
    }
  }

  void logout() => logOutDialog();
}
