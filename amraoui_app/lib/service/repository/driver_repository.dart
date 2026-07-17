import 'dart:io';
import 'dart:typed_data';
import 'package:Vehiqqo/const/api_url/api_url.dart';
import 'package:Vehiqqo/models/driver_model.dart';
import 'package:Vehiqqo/service/api/api.dart';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';

class DriverRepository {
  final Dio _auth = AppApi().sendRequest;

  Future<Map<String, dynamic>?> submitDocuments({
    dynamic licenseDocumentFront,
    dynamic licenseDocumentBack,
    dynamic idDocumentFront,
    dynamic idDocumentBack,
    dynamic contractDocument,
  }) async {
    try {
      final map = <String, dynamic>{};

      if (licenseDocumentFront != null) {
        Uint8List bytes = await licenseDocumentFront.readAsBytes();
        final fileName = (licenseDocumentFront is XFile)
            ? licenseDocumentFront.name
            : licenseDocumentFront.path.split('/').last;
        map['license_document_front'] = MultipartFile.fromBytes(
          bytes,
          filename: fileName,
        );
      }
      if (licenseDocumentBack != null) {
        Uint8List bytes = await licenseDocumentBack.readAsBytes();
        final fileName = (licenseDocumentBack is XFile)
            ? licenseDocumentBack.name
            : licenseDocumentBack.path.split('/').last;
        map['license_document_back'] = MultipartFile.fromBytes(
          bytes,
          filename: fileName,
        );
      }
      if (idDocumentFront != null) {
        Uint8List bytes = await idDocumentFront.readAsBytes();
        final fileName = (idDocumentFront is XFile)
            ? idDocumentFront.name
            : idDocumentFront.path.split('/').last;
        map['id_document_front'] = MultipartFile.fromBytes(
          bytes,
          filename: fileName,
        );
      }
      if (idDocumentBack != null) {
        Uint8List bytes = await idDocumentBack.readAsBytes();
        final fileName = (idDocumentBack is XFile)
            ? idDocumentBack.name
            : idDocumentBack.path.split('/').last;
        map['id_document_back'] = MultipartFile.fromBytes(
          bytes,
          filename: fileName,
        );
      }
      if (contractDocument != null) {
        Uint8List bytes = await contractDocument.readAsBytes();
        final fileName = (contractDocument is XFile)
            ? contractDocument.name
            : contractDocument.path.split('/').last;
        map['contract_document'] = MultipartFile.fromBytes(
          bytes,
          filename: fileName,
        );
      }

      final formData = FormData.fromMap(map);

      final res = await _auth.post(
        AppApiUrl.driverSubmitDocumentsUrl,
        data: formData,
      );

      if (res.statusCode == 200 && res.data['success'] == true) {
        return res.data['data'] as Map<String, dynamic>?;
      }
      throw Exception(res.data['message'] ?? 'Unknown error');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message;
      throw Exception(msg);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Map<String, dynamic>?> getMyProfile() async {
    try {
      final res = await _auth.get(AppApiUrl.driverMyProfileUrl);
      if (res.statusCode == 200 && res.data['success'] == true) {
        return res.data['data'] as Map<String, dynamic>;
      }
    } catch (e) {
      // Handle error
    }
    return null;
  }

  Future<Map<String, dynamic>?> updateProfileImage(dynamic image) async {
    try {
      Uint8List bytes = await image.readAsBytes();
      final fileName = (image is XFile)
          ? image.name
          : image.path.split('/').last;
      final formData = FormData.fromMap({
        'profile_image': MultipartFile.fromBytes(bytes, filename: fileName),
      });

      final res = await _auth.patch(
        AppApiUrl.driverUpdateProfileImageUrl,
        data: formData,
      );

      if (res.statusCode == 200 && res.data['success'] == true) {
        return res.data['data'] as Map<String, dynamic>;
      }
      throw Exception(res.data['message'] ?? 'Unknown error');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message;
      print('DioException updating profile image: $msg');
      throw Exception(msg);
    } catch (e) {
      print('Error updating profile image: $e');
      throw Exception(e.toString());
    }
  }

  Future<Map<String, dynamic>?> updateMySkills(
    List<Map<String, dynamic>> skills,
  ) async {
    try {
      final res = await _auth.patch(
        AppApiUrl.driverUpdateSkillsUrl,
        data: {'skills': skills},
      );

      if (res.statusCode == 200 && res.data['success'] == true) {
        return res.data['data'] as Map<String, dynamic>;
      }
      throw Exception(res.data['message'] ?? 'Unknown error');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message;
      print('DioException updating skills: $msg');
      throw Exception(msg);
    } catch (e) {
      print('Error updating skills: $e');
      throw Exception(e.toString());
    }
  }

  Future<Map<String, dynamic>?> updateProfileDetails(
    Map<String, dynamic> data,
  ) async {
    try {
      final res = await _auth.patch(
        AppApiUrl.driverUpdateProfileUrl,
        data: data,
      );

      if (res.statusCode == 200 && res.data['success'] == true) {
        return res.data['data'] as Map<String, dynamic>;
      }
      throw Exception(res.data['message'] ?? 'Unknown error');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message;
      print('DioException updating profile details: $msg');
      throw Exception(msg);
    } catch (e) {
      print('Error updating profile details: $e');
      throw Exception(e.toString());
    }
  }

  Future<bool> deleteDocument(String documentType) async {
    try {
      final res = await _auth.patch(
        AppApiUrl.driverDeleteDocumentUrl,
        data: {'documentType': documentType},
      );

      if (res.statusCode == 200 && res.data['success'] == true) {
        return true;
      }
      throw Exception(res.data['message'] ?? 'Unknown error');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message;
      throw Exception(msg);
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}
