import 'dart:io';
import 'package:amraoui_app/const/api_url/api_url.dart';
import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/service/api/api.dart';
import 'package:dio/dio.dart';

class DriverRepository {
  final Dio _auth = AppApi().sendRequest;

  Future<DriverModel?> submitDocuments({
    required File licenseDocument,
    required File idDocument,
    File? contractDocument,
  }) async {
    final formData = FormData.fromMap({
      'license_document': await MultipartFile.fromFile(
        licenseDocument.path,
        filename: licenseDocument.path.split('/').last,
      ),
      'id_document': await MultipartFile.fromFile(
        idDocument.path,
        filename: idDocument.path.split('/').last,
      ),
      if (contractDocument != null)
        'contract_document': await MultipartFile.fromFile(
          contractDocument.path,
          filename: contractDocument.path.split('/').last,
        ),
    });

    final res = await _auth.post(
      AppApiUrl.driverSubmitDocumentsUrl,
      data: formData,
    );

    final data = res.data as Map<String, dynamic>?;
    if (data?['success'] == true && data?['data'] != null) {
      return DriverModel.fromJson(data!['data'] as Map<String, dynamic>);
    }
    return null;
  }
}
