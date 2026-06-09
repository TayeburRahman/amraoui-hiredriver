import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/utils/auth_navigation.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:amraoui_app/widgets/dialog_boxes/log_out_dailog.dart';
import 'package:get/get.dart';

class PendingApprovalController extends GetxController {
  final _authRepo = AuthRepository();
  var message = 'Your documents are under admin review.'.obs;

  @override
  void onInit() {
    super.onInit();
    final driver = AuthNavigation.getStoredDriver();
    if (driver?.declineReason != null && driver!.declineReason!.isNotEmpty) {
      message.value = driver.declineReason!;
    }
  }

  Future<void> checkStatus() async {
    appGlobalLoading();
    try {
      final driver = await _authRepo.getProfile();
      hideGlobalLoading();
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
        AppSnackBar.message('Still pending admin approval');
      }
    } catch (e) {
      hideGlobalLoading();
      AppSnackBar.error('Could not refresh status');
    }
  }

  void logout() => logOutDialog();
}
