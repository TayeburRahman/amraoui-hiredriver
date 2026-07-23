import 'dart:io';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:Vehiqqo/service/repository/mission_repository.dart';

class InteriorPhotosScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;
  final Map<String, String?> existingPhotos;
  final bool isDelivery;

  const InteriorPhotosScreen({
    super.key,
    required this.mission,
    required this.reqId,
    this.existingPhotos = const {},
    this.isDelivery = false,
  });

  @override
  State<InteriorPhotosScreen> createState() => _InteriorPhotosScreenState();
}

class _InteriorPhotosScreenState extends State<InteriorPhotosScreen> {
  final ImagePicker _picker = ImagePicker();
  Map<String, String?> capturedImages = {
    'Driver seat - front': null,
    'Passenger seat': null,
    'Back seat right': null,
    'Back seat left': null,
    'Trunk': null,
  };

  @override
  void initState() {
    super.initState();
    widget.existingPhotos.forEach((key, value) {
      if (value != null && value.toString().isNotEmpty) {
        if (key == 'Front') {
          capturedImages['Driver seat - front'] = value;
        } else if (key == 'Front Right') {
          capturedImages['Passenger seat'] = value;
        } else if (key == 'Rear Right') {
          capturedImages['Back seat right'] = value;
        } else if (key == 'Rear') {
          capturedImages['Back seat left'] = value;
        } else {
          capturedImages[key] = value;
        }
      }
    });
  }

  Future<void> _takePhoto(String title) async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        capturedImages[title] = photo.path;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    int count = capturedImages.values.where((v) => v != null).length;
    bool allDone = count == 5;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFC),
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Get.back(result: capturedImages),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              AppText(
                data: widget.isDelivery
                    ? 'Interior Photos at Delivery'
                    : 'Interior Photos',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              AppText(
                data: '$count photos captured',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF64748B),
              ),
              const Gap(height: 24),

              Row(
                children: [
                  Expanded(child: _buildPhotoGridItem('Driver seat - front')),
                  const Gap(width: 16),
                  Expanded(child: _buildPhotoGridItem('Passenger seat')),
                ],
              ),
              const Gap(height: 16),
              Row(
                children: [
                  Expanded(child: _buildPhotoGridItem('Back seat right')),
                  const Gap(width: 16),
                  Expanded(child: _buildPhotoGridItem('Back seat left')),
                ],
              ),
              const Gap(height: 16),
              Row(
                children: [
                  Expanded(child: _buildPhotoGridItem('Trunk')),
                  const Gap(width: 16),
                  const Expanded(child: SizedBox.shrink()),
                ],
              ),

              if (allDone) ...[
                const Gap(height: 24),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: const Center(
                    child: AppText(
                      data: 'All Interior photos captured successfully',
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF047857),
                    ),
                  ),
                ),
              ],
              const Gap(height: 100),
            ],
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.zero,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            onPressed: () async {
              if (!allDone) {
                Get.snackbar(
                  'Required',
                  'Please capture all 5 interior photos to continue.',
                  backgroundColor: Colors.red.withOpacity(0.9),
                  colorText: Colors.white,
                  snackPosition: SnackPosition.bottom,
                  margin: const EdgeInsets.all(20),
                );
                return;
              }

              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (BuildContext context) =>
                    const Center(child: CircularProgressIndicator()),
              );

              try {
                final repo = MissionRepository();
                final Map<String, dynamic> uploadData = {};
                final List<MultipartFile> files = [];
                final List<String> labels = [];

                for (var entry in capturedImages.entries) {
                  if (entry.value != null) {
                    if (entry.value!.startsWith('http') &&
                        !entry.value!.startsWith('blob:http')) {
                      uploadData[entry.key] = entry.value;
                    } else {
                      final bytes = await FlutterImageCompress.compressWithFile(
                        entry.value!,
                        minWidth: 800,
                        minHeight: 800,
                        quality: 70,
                      );
                      if (bytes != null) {
                        files.add(
                          MultipartFile.fromBytes(bytes, filename: 'photo.jpg'),
                        );
                        labels.add(entry.key);
                      }
                    }
                  }
                }

                if (files.isNotEmpty) {
                  uploadData['image'] = files;
                  uploadData['imageLabels'] = labels;
                }

                Response res;
                if (widget.isDelivery) {
                  res = await repo.updateDeliveryInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'interiorPhotos',
                    uploadData,
                  );
                } else {
                  res = await repo.updatePickupInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'interiorPhotos',
                    uploadData,
                  );
                }

                if (mounted) {
                  Navigator.of(context).pop(); // close dialog
                }

                if (res.statusCode == 200) {
                  // Keep local state in sync
                  final inspectionKey = widget.isDelivery
                      ? 'deliveryInspection'
                      : 'pickupInspection';
                  if (widget.mission['details'][inspectionKey] == null) {
                    widget.mission['details'][inspectionKey] =
                        <String, dynamic>{};
                  }
                  widget
                      .mission['details'][inspectionKey]['interiorPhotos'] = res
                      .data['data']['details'][inspectionKey]['interiorPhotos'];

                  if (mounted) Navigator.of(context).pop(capturedImages);
                } else {
                  Get.snackbar('Error', 'Failed to save photos');
                }
              } catch (e) {
                if (mounted) Navigator.of(context).pop();
                Get.snackbar('Error', 'Network error while saving photos');
              }
            },
            child: Ink(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF3B82F6), Color(0xFF06B6D4)],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Container(
                alignment: Alignment.center,
                child: const AppText(
                  data: 'Done - Return to Overview',
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoGridItem(String title) {
    final imagePath = capturedImages[title];
    final bool hasImage = imagePath != null;

    return GestureDetector(
      onTap: () => _takePhoto(title),
      child: Container(
        height: 140,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: hasImage
                      ? Colors.transparent
                      : const Color(0xFFE2E8F0),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(11),
                  ),
                  image: hasImage
                      ? DecorationImage(
                          image:
                              imagePath!.startsWith('http') ||
                                  imagePath.startsWith('blob:')
                              ? NetworkImage(imagePath) as ImageProvider
                              : FileImage(File(imagePath)),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: hasImage
                    ? null
                    : const Center(
                        child: Icon(
                          Icons.camera_alt_outlined,
                          color: Color(0xFF94A3B8),
                          size: 32,
                        ),
                      ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  AppText(
                    data: title,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF0F172A),
                  ),
                  const Icon(Icons.refresh, size: 16, color: Color(0xFF06B6D4)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
