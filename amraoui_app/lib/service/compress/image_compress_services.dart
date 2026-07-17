import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:Vehiqqo/widgets/log_print/error_log.dart';

class ImageCompressServices {
  Future<Uint8List?> _compressAndTryCatch(Uint8List image) async {
    Uint8List? result;
    try {
      result = await FlutterImageCompress.compressWithList(
        image,
        format: CompressFormat.webp,
        quality: 80,
      );
    } on UnsupportedError catch (e) {
      errorLog("_compressAndTryCatch", e);
      result = await FlutterImageCompress.compressWithList(
        image,
        format: CompressFormat.jpeg,
        quality: 80,
      );
    }
    return result;
  }

  Future<File> createImageCompress(String image) async {
    File imageFile = File(image);
    try {
      var imageBytes = await imageFile.readAsBytes();

      var result = await _compressAndTryCatch(imageBytes);
      if (result == null) {
        return imageFile;
      }
      File compressedFile = File('${image}_compressed.jpg');
      await compressedFile.writeAsBytes(result);
      return compressedFile;
    } catch (e) {
      errorLog("_createImageCompress", e);
    }

    return imageFile;
  }
}
