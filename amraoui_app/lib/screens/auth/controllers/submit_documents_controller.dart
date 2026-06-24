import 'dart:io';
import 'package:amraoui_app/const/storage/get_storage.dart';
import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/service/repository/driver_repository.dart';
import 'package:amraoui_app/utils/auth_navigation.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

class SubmitDocumentsController extends GetxController {
  final _driverRepo = DriverRepository();
  final _authRepo = AuthRepository();
  final _picker = ImagePicker();

  var licenseFile = Rxn<XFile>();
  var idFile = Rxn<XFile>();
  var contractFile = Rxn<XFile>();

  Future<void> pickLicense() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked != null) licenseFile.value = picked;
  }

  Future<void> pickId() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked != null) idFile.value = picked;
  }

  Future<void> pickContract() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked != null) contractFile.value = picked;
  }

  Future<void> submit() async {
    if (licenseFile.value == null || idFile.value == null) {
      AppSnackBar.error('Driver license and ID document are required');
      return;
    }

    appGlobalLoading();
    try {
      final driverMap = await _driverRepo.submitDocuments(
        licenseDocument: licenseFile.value,
        idDocument: idFile.value,
        contractDocument: contractFile.value,
      );
      hideGlobalLoading();

      if (driverMap == null) {
        AppSnackBar.error('Failed to submit documents');
        return;
      }

      final driverModel = DriverModel.fromJson(driverMap);
      final profile = await _authRepo.getProfile();
      final updated = profile ?? driverModel;

      final access = AppStorage().getToken();
      final refresh = AppStorage().getRefreshToken() ?? '';
      if (access.isNotEmpty) {
        await AuthNavigation.saveSession(
          accessToken: access,
          refreshToken: refresh,
          driver: updated,
        );
      }

      AppSnackBar.success('Documents submitted. Please wait for admin verification.');
      Get.offAllNamed(AppRoutes.pendingApproval);
    } on DioException catch (e) {
      hideGlobalLoading();
      AppSnackBar.error(e.response?.data?['message']?.toString() ?? 'Upload failed');
    } catch (e) {
      hideGlobalLoading();
      AppSnackBar.error('Upload failed');
    }
  }
}
