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

  var licenseFileFront = Rxn<XFile>();
  var licenseFileBack = Rxn<XFile>();
  var idFileFront = Rxn<XFile>();
  var idFileBack = Rxn<XFile>();
  var contractFile = Rxn<XFile>();

  Future<void> pickLicenseFront() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 50,
      maxWidth: 1080,
      maxHeight: 1080,
    );
    if (picked != null) licenseFileFront.value = picked;
  }

  Future<void> pickLicenseBack() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 50,
      maxWidth: 1080,
      maxHeight: 1080,
    );
    if (picked != null) licenseFileBack.value = picked;
  }

  Future<void> pickIdFront() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 50,
      maxWidth: 1080,
      maxHeight: 1080,
    );
    if (picked != null) idFileFront.value = picked;
  }

  Future<void> pickIdBack() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 50,
      maxWidth: 1080,
      maxHeight: 1080,
    );
    if (picked != null) idFileBack.value = picked;
  }

  Future<void> pickContract() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 50,
      maxWidth: 1080,
      maxHeight: 1080,
    );
    if (picked != null) contractFile.value = picked;
  }

  Future<void> submit() async {
    if (licenseFileFront.value == null || licenseFileBack.value == null || idFileFront.value == null || idFileBack.value == null) {
      AppSnackBar.error('Driver license (front/back) and ID document (front/back) are required');
      return;
    }

    appGlobalLoading();
    try {
      final driverMap = await _driverRepo.submitDocuments(
        licenseDocumentFront: licenseFileFront.value,
        licenseDocumentBack: licenseFileBack.value,
        idDocumentFront: idFileFront.value,
        idDocumentBack: idFileBack.value,
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
