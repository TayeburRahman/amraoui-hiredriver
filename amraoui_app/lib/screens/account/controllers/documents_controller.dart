import 'package:Vehiqqo/service/repository/driver_repository.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

class DocumentsController extends GetxController {
  final DriverRepository _repository = DriverRepository();
  final ImagePicker _picker = ImagePicker();

  var isLoading = true.obs;
  var isUploading = false.obs;

  var licenseDocFront = ''.obs;
  var licenseDocBack = ''.obs;
  var idDocFront = ''.obs;
  var idDocBack = ''.obs;
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
        licenseDocFront.value = data['license_document_front'] ?? '';
        licenseDocBack.value = data['license_document_back'] ?? '';
        idDocFront.value = data['id_document_front'] ?? '';
        idDocBack.value = data['id_document_back'] ?? '';
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
      Get.snackbar(
        'Uploading',
        'Please wait while your document is being uploaded...',
      );

      dynamic licenseFileFront = docType == 'license_document_front'
          ? file
          : null;
      dynamic licenseFileBack = docType == 'license_document_back'
          ? file
          : null;
      dynamic idFileFront = docType == 'id_document_front' ? file : null;
      dynamic idFileBack = docType == 'id_document_back' ? file : null;
      dynamic contractFile = docType == 'contract_document' ? file : null;

      final updatedData = await _repository.submitDocuments(
        licenseDocumentFront: licenseFileFront,
        licenseDocumentBack: licenseFileBack,
        idDocumentFront: idFileFront,
        idDocumentBack: idFileBack,
        contractDocument: contractFile,
      );

      if (updatedData != null) {
        if (docType == 'license_document_front')
          licenseDocFront.value = updatedData['license_document_front'] ?? '';
        if (docType == 'license_document_back')
          licenseDocBack.value = updatedData['license_document_back'] ?? '';
        if (docType == 'id_document_front')
          idDocFront.value = updatedData['id_document_front'] ?? '';
        if (docType == 'id_document_back')
          idDocBack.value = updatedData['id_document_back'] ?? '';
        if (docType == 'contract_document')
          contractDoc.value = updatedData['contract_document'] ?? '';
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
