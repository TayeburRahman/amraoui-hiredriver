import 'dart:io';
import 'package:amraoui_app/const/api_url/api_url.dart';
import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/service/api/api.dart';
import 'package:dio/dio.dart';

class DriverRepository {
  final Dio _auth = AppApi().sendRequest;

  Future<Map<String, dynamic>?> submitDocuments({
    dynamic licenseDocument,
    dynamic idDocument,
    dynamic contractDocument,
  }) async {
    try {
      final map = <String, dynamic>{};

      if (licenseDocument != null) {
        final bytes = await licenseDocument.readAsBytes();
        map['license_document'] = MultipartFile.fromBytes(bytes, filename: licenseDocument.name);
      }
      if (idDocument != null) {
        final bytes = await idDocument.readAsBytes();
        map['id_document'] = MultipartFile.fromBytes(bytes, filename: idDocument.name);
      }
      if (contractDocument != null) {
        final bytes = await contractDocument.readAsBytes();
        map['contract_document'] = MultipartFile.fromBytes(bytes, filename: contractDocument.name);
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
      final bytes = await image.readAsBytes();
      final formData = FormData.fromMap({
        'profile_image': MultipartFile.fromBytes(
          bytes,
          filename: image.name,
        ),
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

  Future<Map<String, dynamic>?> updateMySkills(List<Map<String, dynamic>> skills) async {
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

  Future<Map<String, dynamic>?> updateProfileDetails(Map<String, dynamic> data) async {
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
