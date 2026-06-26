import 'package:amraoui_app/service/repository/driver_repository.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

class DocumentsController extends GetxController {
  final DriverRepository _repository = DriverRepository();
  final ImagePicker _picker = ImagePicker();

  var isLoading = true.obs;
  var isUploading = false.obs;

  var licenseDoc = ''.obs;
  var idDoc = ''.obs;
  var contractDoc = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchDocuments();
  }

  Future<void> fetchDocuments() async {
    try {
      isLoading.value = true;
      final data = await _repository.getMyProfile();
      if (data != null) {
        licenseDoc.value = data['license_document'] ?? '';
        idDoc.value = data['id_document'] ?? '';
        contractDoc.value = data['contract_document'] ?? '';
      }
    } catch (e) {
      print('Error fetching documents: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> pickAndUploadDocument(String docType) async {
    try {
      final XFile? file = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 50,
        maxWidth: 1080,
        maxHeight: 1080,
      );
      if (file == null) return;

      isUploading.value = true;
      Get.snackbar('Uploading', 'Please wait while your document is being uploaded...');

      dynamic licenseFile = docType == 'license_document' ? file : null;
      dynamic idFile = docType == 'id_document' ? file : null;
      dynamic contractFile = docType == 'contract_document' ? file : null;

      final updatedData = await _repository.submitDocuments(
        licenseDocument: licenseFile,
        idDocument: idFile,
        contractDocument: contractFile,
      );

      if (updatedData != null) {
        if (docType == 'license_document') licenseDoc.value = updatedData['license_document'] ?? '';
        if (docType == 'id_document') idDoc.value = updatedData['id_document'] ?? '';
        if (docType == 'contract_document') contractDoc.value = updatedData['contract_document'] ?? '';
        Get.snackbar('Success', 'Document uploaded successfully');
      }
    } catch (e) {
      final msg = e.toString().replaceAll('Exception: ', '');
      Get.snackbar('Upload Failed', msg);
    } finally {
      isUploading.value = false;
    }
  }

}
