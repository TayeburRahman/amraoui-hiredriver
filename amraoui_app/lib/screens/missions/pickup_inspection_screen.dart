import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'exterior_photos_screen.dart';

class PickupInspectionScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;

  const PickupInspectionScreen({
    super.key,
    required this.mission,
    required this.reqId,
  });

  @override
  State<PickupInspectionScreen> createState() => _PickupInspectionScreenState();
}

class _PickupInspectionScreenState extends State<PickupInspectionScreen> {
  int completedCount = 0;
  final int totalCount = 6;
  
  Map<String, String?> exteriorPhotos = {};

  @override
  void initState() {
    super.initState();
    final inspection = widget.mission['details']?['pickupInspection'];
    if (inspection != null && inspection['exteriorPhotos'] != null) {
      final photos = inspection['exteriorPhotos'] as Map<String, dynamic>;
      exteriorPhotos = photos.map((key, value) => MapEntry(key, value?.toString()));
    }
    _checkProgress();
  }

  void _checkProgress() {
    int count = 0;
    bool allExteriorDone = exteriorPhotos.values.where((v) => v != null).length == 6;
    if (allExteriorDone && exteriorPhotos.isNotEmpty) count++;
    
    // Add other section checks here later when implemented
    
    setState(() {
      completedCount = count;
    });
  }

  @override
  Widget build(BuildContext context) {
    bool isExteriorDone = exteriorPhotos.values.where((v) => v != null).length == 6 && exteriorPhotos.isNotEmpty;

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
              const AppText(
                data: 'Pickup Inspection',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              const AppText(
                data: 'Complete all required sections',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF64748B),
              ),
              const Gap(height: 24),
              
              // Progress Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const AppText(data: 'Inspection Progress', fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        AppText(data: '$completedCount/$totalCount completed', fontSize: 13, color: const Color(0xFF64748B)),
                      ],
                    ),
                    const Gap(height: 12),
                    LinearProgressIndicator(
                      value: completedCount / totalCount,
                      backgroundColor: const Color(0xFFE2E8F0),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF60A5FA)),
                      borderRadius: BorderRadius.circular(4),
                      minHeight: 6,
                    ),
                  ],
                ),
              ),
              const Gap(height: 16),
              
              _buildInspectionItem(
                Icons.camera_alt_outlined, 
                'Exterior Photos', 
                '6 photos required',
                isCompleted: isExteriorDone,
                onTap: () async {
                  final result = await Get.to(() => ExteriorPhotosScreen(
                    mission: widget.mission, 
                    reqId: widget.reqId,
                    existingPhotos: exteriorPhotos,
                  ));
                  if (result != null) {
                    setState(() {
                      exteriorPhotos = result as Map<String, String?>;
                      _checkProgress();
                    });
                  }
                }
              ),
              _buildInspectionItem(Icons.camera_alt_outlined, 'Interior Photos', '4 photos required', onTap: () {}),
              _buildInspectionItem(Icons.description_outlined, 'Damage Report', 'Document any damage', onTap: () {}),
              _buildInspectionItem(Icons.speed_outlined, 'Mileage & Fuel Proof', 'Capture odometer & fuel level', onTap: () {}),
              _buildInspectionItem(Icons.upload_file_outlined, 'Upload Documents', 'Upload PV or other documents here', onTap: () {}),
              _buildInspectionItem(Icons.draw_outlined, 'Customer Signature', 'Get customer confirmation', onTap: () {}),
              
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
              backgroundColor: const Color(0xFF93C5FD), // Light blue button, like the image
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            onPressed: () {
              Get.snackbar(
                'Coming Soon', 
                'Inspection forms are under development.',
                backgroundColor: const Color(0xFF10B981), 
                colorText: Colors.white,
                snackPosition: SnackPosition.bottom,
                margin: const EdgeInsets.all(16)
              );
            },
            child: const AppText(data: 'Complete Pickup Inspection', color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
          ),
        ),
      ),
    );
  }

  Widget _buildInspectionItem(IconData icon, String title, String subtitle, {bool isCompleted = false, VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: const BoxDecoration(
                color: Color(0xFFF8FAFC), // Very light gray like the image
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: const Color(0xFF475569), size: 20),
            ),
            const Gap(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppText(data: title, fontSize: 15, fontWeight: FontWeight.bold, color: const Color(0xFF0F172A)),
                  const Gap(height: 2),
                  AppText(data: subtitle, fontSize: 13, color: const Color(0xFF64748B)),
                ],
              ),
            ),
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isCompleted ? const Color(0xFF2563EB) : Colors.transparent,
                border: Border.all(
                  color: isCompleted ? const Color(0xFF2563EB) : const Color(0xFFCBD5E1),
                  width: 2,
                ),
              ),
              child: isCompleted ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
            ),
          ],
        ),
      ),
    );
  }
}
