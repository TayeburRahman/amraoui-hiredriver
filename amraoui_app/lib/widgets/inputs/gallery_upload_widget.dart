import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';

class GalleryUploadWidget extends StatefulWidget {
  final int maxImages;
  final Function(List<File> images) onImagesSelected;

  const GalleryUploadWidget({
    super.key,
    this.maxImages = 10,
    required this.onImagesSelected,
  });

  @override
  State<GalleryUploadWidget> createState() => _GalleryUploadWidgetState();
}

class _GalleryUploadWidgetState extends State<GalleryUploadWidget> {
  final ImagePicker _picker = ImagePicker();
  final List<File> _selectedImages = [];

  Future<void> _pickImages() async {
    try {
      final List<XFile> images = await _picker.pickMultiImage();
      if (images.isNotEmpty) {
        setState(() {
          for (var img in images) {
            if (_selectedImages.length < widget.maxImages) {
              _selectedImages.add(File(img.path));
            }
          }
        });
        widget.onImagesSelected(_selectedImages);
      }
    } catch (e) {
      debugPrint("Error picking images: \$e");
    }
  }

  void _removeImage(int index) {
    setState(() {
      _selectedImages.removeAt(index);
    });
    widget.onImagesSelected(_selectedImages);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const AppText(
              data: "Gallery Upload",
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.primary,
            ),
            AppText(
              data: "\${_selectedImages.length}/\${widget.maxImages}",
              fontSize: 14,
              color: AppColors.primaryTextColor,
            ),
          ],
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            ...List.generate(_selectedImages.length, (index) {
              return Stack(
                children: [
                  Container(
                    width: AppSize.width(value: 80),
                    height: AppSize.width(value: 80),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      image: DecorationImage(
                        image: FileImage(_selectedImages[index]),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 2,
                    right: 2,
                    child: GestureDetector(
                      onTap: () => _removeImage(index),
                      child: Container(
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ),
                  ),
                ],
              );
            }),
            if (_selectedImages.length < widget.maxImages)
              GestureDetector(
                onTap: _pickImages,
                child: Container(
                  width: AppSize.width(value: 80),
                  height: AppSize.width(value: 80),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.primary, width: 1.5),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.add_a_photo,
                      color: AppColors.primary,
                      size: 30,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
