import 'dart:io';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';

class MileageFuelScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;
  final Map<String, dynamic>? existingData;
  final bool isDelivery;

  const MileageFuelScreen({
    super.key,
    required this.mission,
    required this.reqId,
    this.existingData,
    this.isDelivery = false,
  });

  @override
  State<MileageFuelScreen> createState() => _MileageFuelScreenState();
}

class _MileageFuelScreenState extends State<MileageFuelScreen> {
  final TextEditingController _mileageController = TextEditingController();
  String? fuelLevel;
  String? odometerPhoto;
  String? fuelGaugePhoto;

  final ImagePicker _picker = ImagePicker();
  final List<String> fuelOptions = ['Empty', '1/4', '1/2', '3/4', 'Full'];

  @override
  void initState() {
    super.initState();
    if (widget.existingData != null) {
      _mileageController.text = (widget.existingData!['mileage'] ?? '').toString();
      fuelLevel = widget.existingData!['fuelLevel'];
      odometerPhoto = widget.existingData!['odometerPhoto'];
      fuelGaugePhoto = widget.existingData!['fuelGaugePhoto'];
    }
  }

  Future<void> _takePhoto(bool isOdometer) async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        if (isOdometer) {
          odometerPhoto = photo.path;
        } else {
          fuelGaugePhoto = photo.path;
        }
      });
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
          onPressed: () => Get.back(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              AppText(
                data: widget.isDelivery ? 'Final Mileage & Fuel' : 'Mileage & Fuel Proof',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              const AppText(
                data: 'Record odometer and fuel level',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF64748B),
              ),
              const Gap(height: 24),
              
              // Mileage
              _buildSectionTitle('Mileage'),
              const Gap(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(left: 16, right: 8),
                      child: Icon(Icons.speed, color: Color(0xFF06B6D4), size: 20),
                    ),
                    Expanded(
                      child: TextField(
                        controller: _mileageController,
                        keyboardType: TextInputType.number,
                        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                        decoration: const InputDecoration(
                          hintText: 'Enter current mileage (km)',
                          hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const Gap(height: 24),
              _buildSectionTitle('Fuel Level'),
              const Gap(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: fuelOptions.map((option) => _buildFuelOption(option)).toList(),
              ),

              if (fuelLevel != 'Empty') ...[
                const Gap(height: 24),
                _buildSectionTitle('Odometer Photo'),
                const Gap(height: 12),
                _buildPhotoCard(
                  title: 'Capture Odometer',
                  subtitle: 'Take a clear photo of the odometer reading',
                  imagePath: odometerPhoto,
                  onTap: () => _takePhoto(true),
                ),

                const Gap(height: 24),
                _buildSectionTitle('Fuel Gauge Photo'),
                const Gap(height: 12),
                _buildPhotoCard(
                  title: 'Capture Fuel Gauge',
                  subtitle: 'Take a clear photo of the fuel gauge',
                  imagePath: fuelGaugePhoto,
                  onTap: () => _takePhoto(false),
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
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            onPressed: () async {
              if (_mileageController.text.isEmpty) {
                Get.snackbar('Required', 'Please enter mileage', backgroundColor: Colors.red.withOpacity(0.9), colorText: Colors.white, snackPosition: SnackPosition.bottom, margin: const EdgeInsets.all(20));
                return;
              }
              if (fuelLevel == null) {
                Get.snackbar('Required', 'Please select fuel level', backgroundColor: Colors.red.withOpacity(0.9), colorText: Colors.white, snackPosition: SnackPosition.bottom, margin: const EdgeInsets.all(20));
                return;
              }
              if (fuelLevel != 'Empty') {
                if (odometerPhoto == null) {
                  Get.snackbar('Required', 'Please capture odometer photo', backgroundColor: Colors.red.withOpacity(0.9), colorText: Colors.white, snackPosition: SnackPosition.bottom, margin: const EdgeInsets.all(20));
                  return;
                }
                if (fuelGaugePhoto == null) {
                  Get.snackbar('Required', 'Please capture fuel gauge photo', backgroundColor: Colors.red.withOpacity(0.9), colorText: Colors.white, snackPosition: SnackPosition.bottom, margin: const EdgeInsets.all(20));
                  return;
                }
              }

              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (BuildContext context) => const Center(child: CircularProgressIndicator()),
              );

              try {
                final repo = MissionRepository();
                final Map<String, dynamic> uploadData = {
                  'mileage': _mileageController.text,
                  'fuelLevel': fuelLevel,
                };

                final List<MultipartFile> files = [];
                final List<String> labels = [];

                if (fuelLevel != 'Empty') {
                  if (odometerPhoto != null) {
                    bool isNetOdo = odometerPhoto!.startsWith('http') && !odometerPhoto!.startsWith('blob:http');
                    if (!isNetOdo) {
                      final bytes = await FlutterImageCompress.compressWithFile(
                        odometerPhoto!,
                        minWidth: 800,
                        minHeight: 800,
                        quality: 70,
                      );
                      if (bytes != null) {
                        files.add(MultipartFile.fromBytes(bytes, filename: 'odometer.jpg'));
                        labels.add('odometerPhoto');
                      }
                    } else {
                      uploadData['odometerPhoto'] = odometerPhoto;
                    }
                  }

                  if (fuelGaugePhoto != null) {
                    bool isNetFuel = fuelGaugePhoto!.startsWith('http') && !fuelGaugePhoto!.startsWith('blob:http');
                    if (!isNetFuel) {
                      final bytes = await FlutterImageCompress.compressWithFile(
                        fuelGaugePhoto!,
                        minWidth: 800,
                        minHeight: 800,
                        quality: 70,
                      );
                      if (bytes != null) {
                        files.add(MultipartFile.fromBytes(bytes, filename: 'fuel.jpg'));
                        labels.add('fuelGaugePhoto');
                      }
                    } else {
                      uploadData['fuelGaugePhoto'] = fuelGaugePhoto;
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
                    'mileageAndFuel', 
                    uploadData
                  );
                } else {
                  res = await repo.updatePickupInspection(
                    widget.mission['_id'] ?? widget.reqId, 
                    'mileageAndFuel', 
                    uploadData
                  );
                }

                if (mounted) Navigator.of(context).pop();
                
                if (res.statusCode == 200) {
                  final inspectionKey = widget.isDelivery ? 'deliveryInspection' : 'pickupInspection';
                  if (widget.mission['details'][inspectionKey] == null) {
                    widget.mission['details'][inspectionKey] = <String, dynamic>{};
                  }
                  final savedData = res.data['data']['details'][inspectionKey]['mileageAndFuel'];
                  widget.mission['details'][inspectionKey]['mileageAndFuel'] = savedData;

                  if (mounted) Navigator.of(context).pop(savedData);
                } else {
                  Get.snackbar('Error', 'Failed to save data');
                }
              } catch (e) {
                if (mounted) Navigator.of(context).pop();
                Get.snackbar('Error', 'Network error while saving data');
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
                child: const AppText(data: 'Save Proof', color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return AppText(data: title, fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A));
  }

  Widget _buildFuelOption(String option) {
    bool isSelected = fuelLevel == option;
    return GestureDetector(
      onTap: () => setState(() => fuelLevel = option),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF2563EB) : const Color(0xFFE2E8F0),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: AppText(
          data: option,
          fontSize: 13,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
          color: isSelected ? const Color(0xFF2563EB) : const Color(0xFF64748B),
        ),
      ),
    );
  }

  Widget _buildPhotoCard({required String title, required String subtitle, required String? imagePath, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 140,
        width: double.infinity,
        decoration: BoxDecoration(
          color: imagePath != null ? Colors.transparent : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: const Color(0xFFE2E8F0),
            width: 1,
          ),
          image: imagePath != null ? DecorationImage(
            image: imagePath.startsWith('http') || imagePath.startsWith('blob:')
                ? NetworkImage(imagePath) as ImageProvider
                : FileImage(File(imagePath)),
            fit: BoxFit.cover,
          ) : null,
        ),
        child: imagePath != null ? null : Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.camera_alt_outlined, color: Color(0xFF64748B), size: 32),
            const Gap(height: 8),
            AppText(data: title, color: const Color(0xFF334155), fontSize: 14, fontWeight: FontWeight.w600),
            const Gap(height: 4),
            AppText(data: subtitle, color: const Color(0xFF94A3B8), fontSize: 12),
          ],
        ),
      ),
    );
  }
}
