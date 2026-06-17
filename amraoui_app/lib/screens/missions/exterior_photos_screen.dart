import 'dart:io';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData;
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';
import 'package:amraoui_app/widgets/dialog_boxes/app_global_loading.dart';
class ExteriorPhotosScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;
  final Map<String, String?> existingPhotos;

  const ExteriorPhotosScreen({
    super.key,
    required this.mission,
    required this.reqId,
    this.existingPhotos = const {},
  });

  @override
  State<ExteriorPhotosScreen> createState() => _ExteriorPhotosScreenState();
}

class _ExteriorPhotosScreenState extends State<ExteriorPhotosScreen> {
  final ImagePicker _picker = ImagePicker();
  
  late Map<String, String?> capturedImages;

  @override
  void initState() {
    super.initState();
    // Initialize with existing photos if any
    capturedImages = {
      'Front': widget.existingPhotos['Front'],
      'Front Right': widget.existingPhotos['Front Right'],
      'Rear Right': widget.existingPhotos['Rear Right'],
      'Rear': widget.existingPhotos['Rear'],
      'Rear Left': widget.existingPhotos['Rear Left'],
      'Front Left': widget.existingPhotos['Front Left'],
    };
  }

  Future<void> _takePhoto(String position) async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
      );
      if (photo != null) {
        setState(() {
          capturedImages[position] = photo.path;
        });
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to take photo. Please check permissions.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFC),
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Get.back(result: capturedImages), // return data on back
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Gap(height: 24),
              
              // Diagram Card
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Image.asset('assets/images/exterior_diagram.jpg', fit: BoxFit.contain),
              ),
              const Gap(height: 24),

              // Required Photos Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const AppText(
                      data: 'Required Photos',
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                    const Gap(height: 16),
                    _buildPhotoItem('Front'),
                    _buildPhotoItem('Front Right'),
                    _buildPhotoItem('Rear Right'),
                    _buildPhotoItem('Rear'),
                    _buildPhotoItem('Rear Left'),
                    _buildPhotoItem('Front Left', isLast: true),
                  ],
                ),
              ),
              
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
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            onPressed: () async {
              // Upload photos to backend
              if (capturedImages.values.where((v) => v != null).length < 6) {
                Get.snackbar(
                  'Required', 
                  'Please capture all 6 exterior photos to continue.',
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
                builder: (BuildContext context) => const Center(child: CircularProgressIndicator()),
              );

              try {
                final repo = MissionRepository();
                final Map<String, dynamic> uploadData = {};
                final List<MultipartFile> files = [];
                final List<String> labels = [];
                
                for (var entry in capturedImages.entries) {
                  if (entry.value != null) {
                    if (entry.value!.startsWith('http') && !entry.value!.startsWith('blob:http')) {
                      // Already uploaded to server (not a web blob)
                      uploadData[entry.key] = entry.value;
                    } else {
                      final bytes = await XFile(entry.value!).readAsBytes();
                      files.add(MultipartFile.fromBytes(bytes, filename: 'photo.jpg'));
                      labels.add(entry.key);
                    }
                  }
                }
                
                if (files.isNotEmpty) {
                  uploadData['image'] = files;
                  uploadData['imageLabels'] = labels;
                }
                
                final res = await repo.updatePickupInspection(
                  widget.mission['_id'] ?? widget.reqId, 
                  'exteriorPhotos', 
                  uploadData
                );

                if (mounted) {
                  Navigator.of(context).pop(); // close dialog
                }
                
                if (res.statusCode == 200) {
                  // Keep local state in sync
                  if (widget.mission['details']['pickupInspection'] == null) {
                    widget.mission['details']['pickupInspection'] = <String, dynamic>{};
                  }
                  widget.mission['details']['pickupInspection']['exteriorPhotos'] = res.data['data']['details']['pickupInspection']['exteriorPhotos'];

                  if (mounted) {
                    Navigator.of(context).pop(capturedImages); // close screen and return data
                  }
                } else {
                  Get.snackbar('Error', 'Failed to save photos');
                }
              } catch (e) {
                if (mounted) {
                  Navigator.of(context).pop(); // close dialog
                }
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
                child: const AppText(data: 'Save Photos', color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoItem(String title, {bool isLast = false}) {
    final imagePath = capturedImages[title];
    final bool hasImage = imagePath != null;

    return GestureDetector(
      onTap: () => _takePhoto(title),
      child: Container(
        margin: EdgeInsets.only(bottom: isLast ? 0 : 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: hasImage ? Colors.transparent : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(8),
                image: hasImage ? DecorationImage(
                  image: imagePath!.startsWith('http') || imagePath.startsWith('blob:') 
                      ? NetworkImage(imagePath) as ImageProvider
                      : FileImage(File(imagePath)),
                  fit: BoxFit.cover,
                ) : null,
              ),
              child: hasImage 
                  ? null 
                  : const Icon(Icons.camera_alt_outlined, color: Color(0xFF94A3B8), size: 24),
            ),
            const Gap(width: 16),
            Expanded(
              child: AppText(
                data: title,
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF0F172A),
              ),
            ),
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: hasImage ? const Color(0xFF10B981) : Colors.transparent,
                border: Border.all(
                  color: hasImage ? const Color(0xFF10B981) : const Color(0xFFCBD5E1),
                  width: 2,
                ),
              ),
              child: hasImage 
                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
