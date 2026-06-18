import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:amraoui_app/screens/missions/exterior_photos_screen.dart';
import 'package:amraoui_app/screens/missions/interior_photos_screen.dart';
import 'package:amraoui_app/screens/missions/damage_report_screen.dart';
import 'package:amraoui_app/screens/missions/mileage_fuel_screen.dart';
import 'package:amraoui_app/screens/missions/upload_documents_screen.dart';
import 'package:amraoui_app/screens/missions/customer_signature_screen.dart';
import 'package:amraoui_app/screens/missions/delivery_arrival_screen.dart';

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
  late final int totalCount;
  
  Map<String, String?> exteriorPhotos = {};
  Map<String, String?> interiorPhotos = {};
  Map<String, dynamic>? damageReport;
  Map<String, dynamic>? mileageAndFuel;
  List<dynamic> uploadDocuments = [];
  Map<String, dynamic>? customerSignature;

  @override
  void initState() {
    super.initState();
    totalCount = widget.mission['type'] == 'HIRE_DRIVER' ? 3 : 6;
    final inspection = widget.mission['details']?['pickupInspection'];
    if (inspection != null) {
      if (inspection['exteriorPhotos'] != null) {
        final photos = inspection['exteriorPhotos'] as Map<String, dynamic>;
        exteriorPhotos = photos.map((key, value) => MapEntry(key, value?.toString()));
      }
      if (inspection['interiorPhotos'] != null) {
        final photos = inspection['interiorPhotos'] as Map<String, dynamic>;
        interiorPhotos = photos.map((key, value) => MapEntry(key, value?.toString()));
      }
      if (inspection['damageReport'] != null) {
        damageReport = inspection['damageReport'] as Map<String, dynamic>;
      }
      if (inspection['mileageAndFuel'] != null) {
        mileageAndFuel = inspection['mileageAndFuel'] as Map<String, dynamic>;
      }
      if (inspection['uploadDocuments'] != null) {
        uploadDocuments = inspection['uploadDocuments'] as List<dynamic>;
      }
      if (inspection['customerSignature'] != null) {
        customerSignature = inspection['customerSignature'] as Map<String, dynamic>;
      }
    }
    _checkProgress();
  }
  void _checkProgress() {
    int count = 0;
    final type = widget.mission['type'];
    
    if (type != 'HIRE_DRIVER') {
      int extCount = 0;
      for (String key in ['Front', 'Front Right', 'Rear Right', 'Rear', 'Rear Left', 'Front Left']) {
        if (exteriorPhotos[key] != null && exteriorPhotos[key]!.isNotEmpty) extCount++;
      }
      if (extCount == 6) count++;
      
      int intCount = 0;
      for (String key in ['Front', 'Front Right', 'Rear Right', 'Rear']) {
        if (interiorPhotos[key] != null && interiorPhotos[key]!.isNotEmpty) intCount++;
      }
      if (intCount == 4) count++;
      
      if (uploadDocuments.isNotEmpty) count++;
    }
    
    if (damageReport != null && damageReport!.isNotEmpty) count++;
    if (mileageAndFuel != null && mileageAndFuel!.isNotEmpty) count++;
    if (customerSignature != null && customerSignature!.isNotEmpty) count++;
    
    setState(() {
      completedCount = count;
    });
  }

  @override
  Widget build(BuildContext context) {
    int extCount = 0;
    for (String key in ['Front', 'Front Right', 'Rear Right', 'Rear', 'Rear Left', 'Front Left']) {
      if (exteriorPhotos[key] != null && exteriorPhotos[key]!.isNotEmpty) extCount++;
    }
    bool isExteriorDone = extCount == 6;

    int intCount = 0;
    for (String key in ['Front', 'Front Right', 'Rear Right', 'Rear']) {
      if (interiorPhotos[key] != null && interiorPhotos[key]!.isNotEmpty) intCount++;
    }
    bool isInteriorDone = intCount == 4;

    final type = widget.mission['type'];
    final String titleStr = type == 'HIRE_DRIVER' ? 'Pre-Trip Walkaround' : 'Pickup Inspection';

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
                data: titleStr,
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
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
              
              if (type != 'HIRE_DRIVER') _buildInspectionItem(
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
              if (type != 'HIRE_DRIVER') _buildInspectionItem(
                Icons.camera_alt_outlined, 
                'Interior Photos', 
                '4 photos required', 
                isCompleted: isInteriorDone,
                onTap: () async {
                  final result = await Get.to(() => InteriorPhotosScreen(
                    mission: widget.mission, 
                    reqId: widget.reqId,
                    existingPhotos: interiorPhotos,
                  ));
                  if (result != null) {
                    setState(() {
                      interiorPhotos = result as Map<String, String?>;
                      _checkProgress();
                    });
                  }
                }
              ),
              _buildInspectionItem(
                Icons.description_outlined, 
                'Damage Report', 
                'Document any damage', 
                isCompleted: damageReport != null,
                onTap: () async {
                  final result = await Get.to(() => DamageReportScreen(
                    mission: widget.mission, 
                    reqId: widget.reqId,
                    existingReport: damageReport,
                  ));
                  if (result != null) {
                    setState(() {
                      damageReport = result as Map<String, dynamic>;
                      _checkProgress();
                    });
                  }
                }
              ),
              _buildInspectionItem(
                Icons.speed_outlined, 
                'Mileage & Fuel Proof', 
                'Capture odometer & fuel level', 
                isCompleted: mileageAndFuel != null,
                onTap: () async {
                  final result = await Get.to(() => MileageFuelScreen(
                    mission: widget.mission, 
                    reqId: widget.reqId,
                    existingData: mileageAndFuel,
                  ));
                  if (result != null) {
                    setState(() {
                      mileageAndFuel = result as Map<String, dynamic>;
                      _checkProgress();
                    });
                  }
                }
              ),
              if (type != 'HIRE_DRIVER') _buildInspectionItem(
                Icons.upload_file_outlined, 
                'Upload Documents', 
                'Upload PV or other documents here', 
                isCompleted: uploadDocuments.isNotEmpty,
                onTap: () async {
                  final result = await Get.to(() => UploadDocumentsScreen(
                    mission: widget.mission, 
                    reqId: widget.reqId,
                    existingDocuments: uploadDocuments,
                  ));
                  if (result != null) {
                    setState(() {
                      uploadDocuments = result as List<dynamic>;
                      _checkProgress();
                    });
                  }
                }
              ),
              _buildInspectionItem(
                Icons.draw_outlined, 
                'Customer Signature', 
                'Get customer confirmation', 
                isCompleted: customerSignature != null,
                onTap: () async {
                  final result = await Get.to(() => CustomerSignatureScreen(
                    mission: widget.mission, 
                    reqId: widget.reqId,
                    existingSignature: customerSignature,
                  ));
                  if (result != null) {
                    setState(() {
                      customerSignature = result as Map<String, dynamic>;
                      _checkProgress();
                    });
                  }
                }
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
            onPressed: completedCount == totalCount ? () {
              Get.to(() => DeliveryArrivalScreen(
                mission: widget.mission,
                reqId: widget.reqId,
              ));
            } : () {
              Get.snackbar(
                'Incomplete', 
                'Please complete all $totalCount inspection steps first.',
                backgroundColor: const Color(0xFFEF4444), 
                colorText: Colors.white,
                snackPosition: SnackPosition.bottom,
                margin: const EdgeInsets.all(16)
              );
            },
            child: Ink(
              decoration: BoxDecoration(
                gradient: completedCount == totalCount ? const LinearGradient(
                  colors: [Color(0xFF3B82F6), Color(0xFF06B6D4)],
                ) : null,
                color: completedCount == totalCount ? null : const Color(0xFF93C5FD),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Container(
                alignment: Alignment.center,
                child: const AppText(data: 'Complete Pickup Inspection', color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
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
              decoration: BoxDecoration(
                color: isCompleted ? const Color(0xFFD1FAE5) : const Color(0xFFF8FAFC),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: isCompleted ? const Color(0xFF10B981) : const Color(0xFF475569), size: 20),
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
                color: Colors.transparent,
                border: Border.all(
                  color: isCompleted ? const Color(0xFF10B981) : const Color(0xFFCBD5E1),
                  width: 1.5,
                ),
              ),
              child: isCompleted ? const Icon(Icons.check, size: 16, color: Color(0xFF10B981)) : null,
            ),
          ],
        ),
      ),
    );
  }
}
