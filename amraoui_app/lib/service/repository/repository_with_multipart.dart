// ignore_for_file: depend_on_referenced_packages

import 'dart:developer';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:amraoui_app/service/api/api_post_services.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import '../api/api_patch_services.dart';
import '../compress/compress_image_widget.dart';

class RepositoryWithMultipart {
  Future<dynamic> apiPatchServices({
    required String url,
    String? imagePath,
    List<String>? imagePathList,
    String? imageMapKeyName,
    Map<String, dynamic>? body,
  }) async {
    try {
      // Initialize FormData with the body fields
      FormData formData = FormData.fromMap(body ?? {});

      // Check if an image path is provided
      if (imagePath != null) {
        final file = File(imagePath);
        if (await file.exists()) {
          final compressedFile = await compressImage(file);
          String fileName = compressedFile.path.split('/').last;
          String? mimeType = lookupMimeType(file.path);

          // Add the file to FormData
          formData.files.add(
            MapEntry(
              imageMapKeyName ?? "image", // Key as per the API documentation
              await MultipartFile.fromFile(
                file.path,
                filename: fileName,
                contentType: mimeType != null ? MediaType.parse(mimeType) : null,
              ),
            ),
          );
        }
      }
      if (imagePathList != null && imagePathList.isNotEmpty) {
        for (var element in imagePathList) {
          final file = File(element);
          if (await file.exists()) {
            final compressedFile = await compressImage(file);

            String fileName = compressedFile.path.split('/').last;

            // Ensure mimeType isn't null and safely lookup mime type
            String? mimeType = lookupMimeType(compressedFile.path);

            // Add the file to FormData
            formData.files.add(
              MapEntry(
                imageMapKeyName ?? "image", // Key as per the API documentation
                await MultipartFile.fromFile(
                  compressedFile.path, // Use the path of the compressed file
                  filename: fileName,
                  contentType: mimeType != null ? MediaType.parse(mimeType) : null,
                ),
              ),
            );
          }
        }
      }

      // Send the API request
      var data = await ApiPatchServices().apiPatchServices(
        url: url,
        body: formData,
      );

      if (data != null) {
        return data;
      }
    } catch (e) {
      log("$e");
    }

    return null;
  }

  Future<dynamic> apiPostServices({
    required String url,
    String? imagePath,
    String? imagePath2,
    List<String>? imagePathList,
    List<String>? imagePathList2,
    String? imageMapKeyNameForimagePathList,
    String? imageMapKeyNameForimagePathList2,
    String? imageMapKeyNameimagePath,
    String? imageMapKeyNameimagePath2,
    String? body,
  }) async {
    try {
      // Initialize FormData with the body fields
      FormData formData = FormData.fromMap({"data": body});

      // Check if an image path is provided
      if (imagePath != null) {
        final file = File(imagePath);
        if (await file.exists()) {
          final compressedFile = await compressImage(file);
          String fileName = compressedFile.path.split('/').last;
          String? mimeType = lookupMimeType(file.path);

          // Add the file to FormData
          formData.files.add(
            MapEntry(
              imageMapKeyNameimagePath ?? "image", // Key as per the API documentation
              await MultipartFile.fromFile(
                file.path,
                filename: fileName,
                contentType: mimeType != null ? MediaType.parse(mimeType) : null,
              ),
            ),
          );
        }
      }
      // Check if an image path is provided
      if (imagePath2 != null) {
        final file = File(imagePath2);
        if (await file.exists()) {
          final compressedFile = await compressImage(file);
          String fileName = compressedFile.path.split('/').last;
          String? mimeType = lookupMimeType(file.path);

          // Add the file to FormData
          formData.files.add(
            MapEntry(
              imageMapKeyNameimagePath2 ?? "image", // Key as per the API documentation
              await MultipartFile.fromFile(
                file.path,
                filename: fileName,
                contentType: mimeType != null ? MediaType.parse(mimeType) : null,
              ),
            ),
          );
        }
      }
      if (imagePathList != null && imagePathList.isNotEmpty) {
        for (var element in imagePathList) {
          final file = File(element);
          if (await file.exists()) {
            final compressedFile = await compressImage(file);
            String fileName = compressedFile.path.split('/').last;

            // Ensure mimeType isn't null and safely lookup mime type
            String? mimeType = lookupMimeType(compressedFile.path);

            // Add the file to FormData
            formData.files.add(
              MapEntry(
                imageMapKeyNameForimagePathList ?? "image", // Key as per the API documentation
                await MultipartFile.fromFile(
                  compressedFile.path, // Use the path of the compressed file
                  filename: fileName,
                  contentType: mimeType != null ? MediaType.parse(mimeType) : null,
                ),
              ),
            );
          }
        }
      }
      if (imagePathList2 != null && imagePathList2.isNotEmpty) {
        for (var element in imagePathList2) {
          final file = File(element);
          if (await file.exists()) {
            final compressedFile = await compressImage(file);

            String fileName = compressedFile.path.split('/').last;

            // Ensure mimeType isn't null and safely lookup mime type
            String? mimeType = lookupMimeType(compressedFile.path);

            // Add the file to FormData
            formData.files.add(
              MapEntry(
                imageMapKeyNameForimagePathList2 ?? "image", // Key as per the API documentation
                await MultipartFile.fromFile(
                  compressedFile.path, // Use the path of the compressed file
                  filename: fileName,
                  contentType: mimeType != null ? MediaType.parse(mimeType) : null,
                ),
              ),
            );
          }
        }
      }

      // Send the API request
      var data = await ApiPostServices().apiPostServices(
        url: url,
        body: formData,
      );

      if (data != null) {
        return data;
      }
    } catch (e) {
      log("$e");
    }

    return null;
  }

  Future<dynamic> eventUpdateServices({
    required String url,
    String? imagePath,
    // String? imagePath2,
    List<String>? imagePathList,
    List<String>? imagePathList2,
    String? imageMapKeyNameForimagePathList,
    // String? imageMapKeyNameForimagePathList2,
    String? imageMapKeyNameimagePath,
    String? imageMapKeyNameimagePath2,
    String? body,
  }) async {
    try {
      // Initialize FormData with the body fields
      FormData formData = FormData.fromMap({"data": body});

      // Check if an image path is provided
      if (imagePath != null) {
        final file = File(imagePath);
        if (await file.exists()) {
          final compressedFile = await compressImage(file);
          String fileName = compressedFile.path.split('/').last;
          String? mimeType = lookupMimeType(file.path);

          // Add the file to FormData
          formData.files.add(
            MapEntry(
              imageMapKeyNameimagePath ?? "image", // Key as per the API documentation
              await MultipartFile.fromFile(
                file.path,
                filename: fileName,
                contentType: mimeType != null ? MediaType.parse(mimeType) : null,
              ),
            ),
          );
        }
      }
      // Check if an image path is provided
      // if (imagePath2 != null) {
      //   final file = File(imagePath2);
      //   if (await file.exists()) {
      //     final compressedFile = await compressImage(file);
      //     String fileName = compressedFile.path.split('/').last;
      //     String? mimeType = lookupMimeType(file.path);

      //     // Add the file to FormData
      //     formData.files.add(
      //       MapEntry(
      //         imageMapKeyNameimagePath2 ?? "image", // Key as per the API documentation
      //         await MultipartFile.fromFile(
      //           file.path,
      //           filename: fileName,
      //           contentType: mimeType != null ? MediaType.parse(mimeType) : null,
      //         ),
      //       ),
      //     );
      //   }
      // }
      if (imagePathList != null && imagePathList.isNotEmpty) {
        for (var element in imagePathList) {
          final file = File(element);
          if (await file.exists()) {
            final compressedFile = await compressImage(file);
            String fileName = compressedFile.path.split('/').last;

            // Ensure mimeType isn't null and safely lookup mime type
            String? mimeType = lookupMimeType(compressedFile.path);

            // Add the file to FormData
            formData.files.add(
              MapEntry(
                imageMapKeyNameForimagePathList ?? "image", // Key as per the API documentation
                await MultipartFile.fromFile(
                  compressedFile.path, // Use the path of the compressed file
                  filename: fileName,
                  contentType: mimeType != null ? MediaType.parse(mimeType) : null,
                ),
              ),
            );
          }
        }
      }
      // if (imagePathList2 != null && imagePathList2.isNotEmpty) {
      //   for (var element in imagePathList2) {
      //     final file = File(element);
      //     if (await file.exists()) {
      //       final compressedFile = await compressImage(file);

      //       String fileName = compressedFile.path.split('/').last;

      //       // Ensure mimeType isn't null and safely lookup mime type
      //       String? mimeType = lookupMimeType(compressedFile.path);

      //       // Add the file to FormData
      //       formData.files.add(
      //         MapEntry(
      //           imageMapKeyNameForimagePathList2 ?? "image", // Key as per the API documentation
      //           await MultipartFile.fromFile(
      //             compressedFile.path, // Use the path of the compressed file
      //             filename: fileName,
      //             contentType: mimeType != null ? MediaType.parse(mimeType) : null,
      //           ),
      //         ),
      //       );
      //     }
      //   }
      // }

      // Send the API request
      var data = await ApiPatchServices().apiPatchServices(
        url: url,
        body: formData,
      );

      if (data != null) {
        return data;
      }
    } catch (e) {
      log("$e");
    }

    return null;
  }
}
