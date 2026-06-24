import 'dart:io';
import 'dart:typed_data';
import 'package:amraoui_app/const/api_url/api_url.dart';
import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/service/api/api.dart';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';

class DriverRepository {
  final Dio _auth = AppApi().sendRequest;

  Future<Uint8List> _compressIfNeeded(Uint8List bytes, String fileName) async {
    // Only compress if > 1MB and is an image
    if (bytes.length < 1024 * 1024) return bytes;
    
    final ext = fileName.split('.').last.toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].contains(ext)) return bytes;

    try {
      final compressed = await FlutterImageCompress.compressWithList(
        bytes,
        minWidth: 1080,
        minHeight: 1080,
        quality: 70,
        format: CompressFormat.jpeg,
      );
      return compressed.isNotEmpty ? compressed : bytes;
    } catch (e) {
      return bytes;
    }
  }

  Future<Map<String, dynamic>?> submitDocuments({
    dynamic licenseDocument,
    dynamic idDocument,
    dynamic contractDocument,
  }) async {
    try {
      final map = <String, dynamic>{};

      if (licenseDocument != null) {
        Uint8List bytes = await licenseDocument.readAsBytes();
        final fileName = (licenseDocument is XFile) ? licenseDocument.name : licenseDocument.path.split('/').last;
        bytes = await _compressIfNeeded(bytes, fileName);
        map['license_document'] = MultipartFile.fromBytes(bytes, filename: fileName);
      }
      if (idDocument != null) {
        Uint8List bytes = await idDocument.readAsBytes();
        final fileName = (idDocument is XFile) ? idDocument.name : idDocument.path.split('/').last;
        bytes = await _compressIfNeeded(bytes, fileName);
        map['id_document'] = MultipartFile.fromBytes(bytes, filename: fileName);
      }
      if (contractDocument != null) {
        Uint8List bytes = await contractDocument.readAsBytes();
        final fileName = (contractDocument is XFile) ? contractDocument.name : contractDocument.path.split('/').last;
        bytes = await _compressIfNeeded(bytes, fileName);
        map['contract_document'] = MultipartFile.fromBytes(bytes, filename: fileName);
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
      final fileName = (image is XFile) ? image.name : image.path.split('/').last;
      bytes = await _compressIfNeeded(bytes, fileName);
      final formData = FormData.fromMap({
        'profile_image': MultipartFile.fromBytes(
          bytes,
          filename: fileName,
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
