// // ignore_for_file: depend_on_referenced_packages

// import 'dart:developer';
// import 'dart:io';
// import 'package:dio/dio.dart';
// import 'package:http_parser/http_parser.dart';
// import 'package:mime/mime.dart';
// import '../api/api_patch_services.dart';
// import '../api/api_post_services.dart';
// import '../compress/compress_image_widget.dart';

// class ImageRepository {
//   Future<dynamic> imageUploadWithData({
//     required String url,
//     String? imagePath,
//     required Map<String, dynamic> body,
//   }) async {
//     try {
//       // Initialize FormData with the body fields
//       FormData formData = FormData.fromMap(body);

//       // Check if an image path is provided
//       if (imagePath != null) {
//         final file = File(imagePath);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'image', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }

//       // Send the API request
//       var data = await ApiPostServices().apiPostServices(
//         url: url,
//         body: formData,
//         // token: AppStorage().getToken(),
//       );

//       if (data != null) {
//         // appLog("💕💕💕💕💕 ${data["data"].runtimeType}");
//         if (data["data"].runtimeType != Null) {
//           // appLog("💕💕💕💕💕 $data");
//           // return MessageListModel.fromJson(data["data"]);
//         }
//       }
//     } catch (e) {
//       log("$e");
//     }

//     return null;
//   }

//   Future<dynamic> editSellerProduct({
//     required String url,
//     String? primaryImage,
//     String? secondaryImage,
//     String? tertiaryImage,
//     String? videoFile,
//     required Map<String, dynamic> body,
//   }) async {
//     try {
//       // Initialize FormData with the body fields
//       FormData formData = FormData.fromMap(body);

//       // Primary Image
//       if (primaryImage != null) {
//         final file = File(primaryImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'primary', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }
//       // Secondary Image
//       if (secondaryImage != null) {
//         final file = File(secondaryImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'secondary', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }
//       // Tertiary Image
//       if (tertiaryImage != null) {
//         final file = File(tertiaryImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'tertiary', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }
//       // Video File
//       if (videoFile != null) {
//         final file = File(videoFile);
//         if (await file.exists()) {
//           // final compressedFile = await compressImage(file);
//           String fileName = file.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'video', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }

//       // Send the API request
//       // var data = await ApiPostServices().apiPostServices(
//       var data = await ApiPatchServices().apiPatchServices(
//         url: url,
//         body: formData,
//         // token: AppStorage().getToken(),
//       );

//       if (data != null) {
//         return data;
//       }
//     } catch (e) {
//       log("$e");
//     }

//     return null;
//   }

//   Future<dynamic> createSellerProduct({
//     required String url,
//     String? primaryImage,
//     String? secondaryImage,
//     String? tertiaryImage,
//     String? videoFile,
//     required Map<String, dynamic> body,
//   }) async {
//     try {
//       // Initialize FormData with the body fields
//       FormData formData = FormData.fromMap(body);

//       // Primary Image
//       if (primaryImage != null) {
//         final file = File(primaryImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'primary', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }
//       // Secondary Image
//       if (secondaryImage != null) {
//         final file = File(secondaryImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'secondary', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }
//       // Tertiary Image
//       if (tertiaryImage != null) {
//         final file = File(tertiaryImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'tertiary', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }
//       // Video File
//       if (videoFile != null) {
//         final file = File(videoFile);
//         if (await file.exists()) {
//           // final compressedFile = await compressImage(file);
//           String fileName = file.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'video', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }

//       // Send the API request
//       var data = await ApiPostServices().apiPostServices(
//         // var data = await ApiPatchServices().apiPatchServices(
//         url: url,
//         body: formData,
//         // token: AppStorage().getToken(),
//       );

//       if (data != null) {
//         return data;
//       }
//     } catch (e) {
//       log("$e");
//     }

//     return null;
//   }

//   Future<dynamic> bankInfoUpdate({
//     required String url,
//     String? businessPANImage,
//     String? signatureImage,
//     required Map<String, dynamic> body,
//   }) async {
//     try {
//       // Initialize FormData with the body fields
//       FormData formData = FormData.fromMap(body);

//       // Check if an image path is provided
//       if (businessPANImage != null) {
//         final file = File(businessPANImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'business_pan_identity', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }
//       // Check if an image path is provided
//       if (signatureImage != null) {
//         final file = File(signatureImage);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'signature', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }

//       // Send the API request
//       var data = await ApiPostServices().apiPostServices(
//         // var data = await ApiPatchServices().apiPatchServices(
//         url: url,
//         body: formData,
//         // token: AppStorage().getToken(),
//       );

//       if (data != null) {
//         return data;
//       }
//     } catch (e) {
//       log("$e");
//     }

//     return null;
//   }

//   Future<dynamic> profilePatchImageUpdate({
//     required String url,
//     String? imagePath,
//     Map<String, dynamic>? body,
//   }) async {
//     try {
//       // Initialize FormData with the body fields
//       FormData formData = FormData.fromMap(body ?? {});

//       // Check if an image path is provided
//       if (imagePath != null) {
//         final file = File(imagePath);
//         if (await file.exists()) {
//           final compressedFile = await compressImage(file);
//           String fileName = compressedFile!.path.split('/').last;
//           String? mimeType = lookupMimeType(file.path);

//           // Add the file to FormData
//           formData.files.add(
//             MapEntry(
//               'image', // Key as per the API documentation
//               await MultipartFile.fromFile(
//                 file.path,
//                 filename: fileName,
//                 contentType: mimeType != null ? MediaType.parse(mimeType) : null,
//               ),
//             ),
//           );
//         }
//       }

//       // Send the API request
//       var data = await ApiPatchServices().apiPatchServices(
//         url: url,
//         body: formData,
//         // token: AppStorage().getToken(),
//       );

//       if (data != null) {
//         return data;
//       }
//     } catch (e) {
//       log("$e");
//     }

//     return null;
//   }
// }
