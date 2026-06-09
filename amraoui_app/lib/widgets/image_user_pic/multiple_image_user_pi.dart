import 'dart:io';

import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';

Future<void> userImagePic2(
  ImageSource source,
  RxList<String> localImagePath,
) async {
  try {
    List<XFile>? pickedField;
    if (source == ImageSource.camera) {
      var cameraStatus = await Permission.camera.status;

      if (cameraStatus.isGranted) {
        pickedField = await ImagePicker().pickMultiImage();
      } else if (cameraStatus.isDenied) {
        var cameraStatus2 = await Permission.camera.request();
        if (cameraStatus2.isGranted) {
          pickedField = await ImagePicker().pickMultiImage();
        } else {
          AppSnackBar.error("Camera Permission Needed");
          return;
        }
      } else if (cameraStatus.isRestricted) {
        AppSnackBar.error("Camera Permission Restricted");
        return;
      }
    } else {
      var mediaLibraryStatus = await Permission.mediaLibrary.status;
      var mediaStorageStatus = await Permission.manageExternalStorage.status;

      if (mediaLibraryStatus.isGranted || mediaStorageStatus.isGranted) {
        pickedField = await ImagePicker().pickMultiImage();
      } else {
        var mediaLibraryStatus2 = await Permission.mediaLibrary.request();
        var mediaStorageStatus2 = await Permission.manageExternalStorage
            .request();

        if (mediaLibraryStatus2.isGranted || mediaStorageStatus2.isGranted) {
          pickedField = await ImagePicker().pickMultiImage();
        } else {
          AppSnackBar.error("Media Permission Needed");
          return;
        }
      }
    }

    if (pickedField != null) {
      for (var element in pickedField) {
        // if (localImagePath.length < 5) {
        localImagePath.add(File(element.path).path);
        // } else {
        //   return AppSnackBar.error("You can select only 5 Images");
        // }
      }
    }
  } catch (e) {
    AppSnackBar.error("Something Was Wrong");
  }
}

// imageUserTake2(RxList<String> localImagePath) {
//   Get.bottomSheet(
//     Container(
//       margin: EdgeInsets.all(AppSize.height(value: 20.0)),
//       padding: EdgeInsets.all(AppSize.height(value: 10.0)),
//       decoration: BoxDecoration(
//           color: AppColors.white50,
//           borderRadius: BorderRadius.circular(AppSize.width(value: 12.0))),
//       child: Column(
//         mainAxisSize: MainAxisSize.min,
//         children: [
//           Align(
//             alignment: Alignment.topRight,
//             child: IconButton(
//                 onPressed: () {
//                   // Get.back();
//                   Get.closeAllBottomSheets();
//                 },
//                 icon: const Icon(Icons.close)),
//           ),
//           const Gap(height: 20),
//           Row(
//             children: [
//               Expanded(
//                 child: GestureDetector(
//                   onTap: () {
//                     // Get.back();
//                     userImagePic2(ImageSource.camera, localImagePath);
//                     Get.closeAllBottomSheets();
//                   },
//                   child: Material(
//                     elevation: 3,
//                     child: CircleAvatar(
//                       // decoration: BoxDecoration(
//                       //     border: Border.all(),
//                       //     borderRadius: BorderRadius.circular(500)),
//                       child: const Column(
//                         mainAxisAlignment: MainAxisAlignment.center,
//                         children: [
//                           Icon(
//                             Icons.camera_alt,
//                             size: 50,
//                             color: AppColors.primary500,
//                           ),
//                           AppText(
//                             data: "Camera",
//                             fontWeight: FontWeight.w700,
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                 ),
//               ),
//               Expanded(
//                 child: GestureDetector(
//                   onTap: () {
//                     userImagePic2(ImageSource.gallery, localImagePath);
//                     Get.closeAllBottomSheets();
//                   },
//                   child: const Column(
//                     mainAxisAlignment: MainAxisAlignment.center,
//                     children: [
//                       Icon(
//                         Icons.collections,
//                         size: 50,
//                         color: AppColors.primary500,
//                       ),
//                       AppText(
//                         data: "Gallery",
//                         fontWeight: FontWeight.w700,
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ],
//           ),
//           const Gap(height: 20),
//         ],
//       ),
//     ),
//   );
// }

void imageUserTake2(RxList<String> localImagePath) {
  Get.bottomSheet(
    SafeArea(
      child: Container(
        margin: EdgeInsets.all(AppSize.height(value: 20.0)),
        padding: EdgeInsets.all(AppSize.height(value: 10.0)),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppSize.width(value: 12.0)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () {
                  Get.back();
                },
                icon: const Icon(Icons.close),
              ),
            ),
            const Gap(height: 20),
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      userImagePic2(ImageSource.camera, localImagePath);
                      Get.back();
                    },
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.camera_alt,
                          size: 60,
                          color: AppColors.primary,
                        ),
                        AppText(data: "Camera", fontWeight: FontWeight.w700),
                      ],
                    ),
                  ),
                ),
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      userImagePic2(ImageSource.gallery, localImagePath);
                      Get.back();
                    },
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.collections,
                          size: 60,
                          color: AppColors.primary,
                        ),
                        AppText(data: "Gallery", fontWeight: FontWeight.w700),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const Gap(height: 20),
          ],
        ),
      ),
    ),
  );
}
