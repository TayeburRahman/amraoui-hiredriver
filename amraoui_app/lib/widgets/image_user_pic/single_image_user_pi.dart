import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';

Future<void> userImagePic(ImageSource source, RxString localImagePath) async {
  try {
    XFile? pickedField;
    if (source == ImageSource.camera) {
      var cameraStatus = await Permission.camera.status;

      if (cameraStatus.isGranted) {
        pickedField = await ImagePicker().pickImage(
          source: source,
          imageQuality: 50,
          maxWidth: 1080,
          maxHeight: 1080,
        );
      } else if (cameraStatus.isDenied) {
        var cameraStatus2 = await Permission.camera.request();
        if (cameraStatus2.isGranted) {
          pickedField = await ImagePicker().pickImage(
            source: source,
            imageQuality: 50,
            maxWidth: 1080,
            maxHeight: 1080,
          );
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
        pickedField = await ImagePicker().pickImage(
          source: source,
          imageQuality: 50,
          maxWidth: 1080,
          maxHeight: 1080,
        );
      } else {
        var mediaLibraryStatus2 = await Permission.mediaLibrary.request();
        var mediaStorageStatus2 = await Permission.manageExternalStorage
            .request();

        if (mediaLibraryStatus2.isGranted || mediaStorageStatus2.isGranted) {
          pickedField = await ImagePicker().pickImage(
            source: source,
            imageQuality: 50,
            maxWidth: 1080,
            maxHeight: 1080,
          );
        } else {
          AppSnackBar.error("Media Permission Needed");
          return;
        }
      }
    }

    if (pickedField != null) {
      localImagePath.value = File(pickedField.path).path;
    }
  } catch (e) {
    AppSnackBar.error("Something Was Wrong");
  }
}

void imageUserTake(RxString localImagePath) {
  Get.bottomSheet(
    SafeArea(
      child: Container(
        margin: EdgeInsets.all(AppSize.height(value: 20.0)),
        padding: EdgeInsets.all(AppSize.height(value: 10.0)),
        decoration: BoxDecoration(
          color: Colors.white,
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
                      userImagePic(ImageSource.camera, localImagePath);
                      Get.back();
                    },
                    child: const Column(
                      children: [
                        Icon(Icons.camera_alt, size: 60, color: Colors.black),
                        AppText(data: "Camera", fontWeight: FontWeight.w700),
                      ],
                    ),
                  ),
                ),
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      userImagePic(ImageSource.gallery, localImagePath);
                      Get.back();
                    },
                    child: const Column(
                      children: [
                        Icon(Icons.collections, size: 60, color: Colors.black),
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
