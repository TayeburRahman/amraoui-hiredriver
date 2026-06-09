import 'dart:io';
import 'package:flutter_image_compress/flutter_image_compress.dart';

Future<XFile> compressImage(File file) async {
  final originalName = file.path.split('/').last;
  final newName = originalName.split('.').first; // remove extension

  final targetPath = '${file.parent.path}/compressed_$newName.webp';

  final compressedImage = await FlutterImageCompress.compressAndGetFile(
    file.path,
    targetPath, // MUST end with .webp
    quality: 50,
    format: CompressFormat.webp,
  );

  return compressedImage ?? XFile(file.path);
}
