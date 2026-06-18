import 'dart:io';
import 'dart:ui';
import 'dart:typed_data';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:image_picker/image_picker.dart';
import 'package:signature/signature.dart';
import 'package:dio/dio.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';
import 'package:amraoui_app/screens/missions/exterior_photos_screen.dart';
import 'package:amraoui_app/screens/missions/interior_photos_screen.dart';
import 'package:amraoui_app/screens/missions/damage_report_screen.dart';
import 'package:amraoui_app/screens/missions/mileage_fuel_screen.dart';
import 'package:amraoui_app/screens/missions/upload_documents_screen.dart';
import 'package:amraoui_app/screens/missions/customer_signature_screen.dart';
import 'package:amraoui_app/screens/missions/receiver_id_verification_screen.dart';
import 'package:amraoui_app/screens/missions/mission_complete_screen.dart';

class DeliveryInspectionScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;

  const DeliveryInspectionScreen({
    super.key,
    required this.mission,
    required this.reqId,
  });

  @override
  State<DeliveryInspectionScreen> createState() =>
      _DeliveryInspectionScreenState();
}

class _DeliveryInspectionScreenState extends State<DeliveryInspectionScreen> {
  int completedCount = 0;
  late final int totalCount;
  late Map<String, dynamic> localMission;

  final ImagePicker _picker = ImagePicker();
  String? driverSelfiePath;
  String? existingDriverSelfieUrl;
  
  final SignatureController _signatureController = SignatureController(
    penStrokeWidth: 3,
    penColor: Colors.black,
    exportBackgroundColor: Colors.white,
  );
  String? existingDriverSignatureUrl;

  @override
  void initState() {
    super.initState();
    localMission = Map.from(widget.mission);
    final type = localMission['type'];
    if (type == 'HIRE_DRIVER') {
      totalCount = 2;
    } else if (type == 'INSPECTION') {
      totalCount = 6;
    } else {
      totalCount = 7;
    }
    
    _calculateProgress();
    
    final inspection = localMission['details']?['deliveryInspection'] ?? {};
    final driverConf = inspection['driverConfirmation'] ?? {};
    existingDriverSelfieUrl = driverConf['driverSelfiePhoto'];
    existingDriverSignatureUrl = driverConf['driverSignaturePhoto'];
  }

  @override
  void dispose() {
    _signatureController.dispose();
    super.dispose();
  }

  void _calculateProgress() {
    final details = localMission['details'] ?? {};
    final inspection = details['deliveryInspection'] ?? {};

    int count = 0;
    final type = localMission['type'];
    
    if (type != 'HIRE_DRIVER') {
      if (inspection['exteriorPhotos'] != null) count++;
      if (inspection['interiorPhotos'] != null) count++;
      if (inspection['damageReport'] != null) count++;
      if (inspection['uploadDocuments'] != null && (inspection['uploadDocuments'] as List).isNotEmpty) count++;
    }
    
    if (inspection['mileageAndFuel'] != null) count++;
    if (inspection['customerSignature'] != null) count++;
    
    if (type == 'TRANSPORT') {
      if (inspection['receiverIdVerification'] != null) count++;
    }
    
    setState(() {
      completedCount = count;
    });
  }

  @override
  Widget build(BuildContext context) {
    final details = localMission['details'] ?? {};
    final inspection = details['deliveryInspection'] ?? {};

    final bool hasExterior = inspection['exteriorPhotos'] != null;
    final bool hasInterior = inspection['interiorPhotos'] != null;
    final bool hasDamage = inspection['damageReport'] != null;
    final bool hasMileage = inspection['mileageAndFuel'] != null;
    final bool hasDocuments = inspection['uploadDocuments'] != null && (inspection['uploadDocuments'] as List).isNotEmpty;
    final bool hasSignature = inspection['customerSignature'] != null;
    final bool hasReceiverId = inspection['receiverIdVerification'] != null;

    final type = localMission['type'];
    String titleStr = 'Delivery Inspection';
    if (type == 'INSPECTION') titleStr = 'Technical Inspection Report';
    if (type == 'HIRE_DRIVER') titleStr = 'Post-Trip Handover';

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
                        const AppText(
                          data: 'Inspection Progress',
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                        AppText(
                          data: '$completedCount/$totalCount completed',
                          fontSize: 13,
                          color: const Color(0xFF64748B),
                        ),
                      ],
                    ),
                    const Gap(height: 12),
                    LinearProgressIndicator(
                      value: completedCount / totalCount,
                      backgroundColor: const Color(0xFFE2E8F0),
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        Color(0xFFC4B5FD),
                      ), // Light purple progress bar
                      borderRadius: BorderRadius.circular(4),
                      minHeight: 6,
                    ),
                  ],
                ),
              ),
              const Gap(height: 16),

              if (type != 'HIRE_DRIVER') _buildInspectionItem(
                Icons.camera_alt_outlined,
                'Exterior Photos at Delivery',
                'Take final exterior photos',
                isCompleted: hasExterior,
                onTap: () async {
                  final result = await Get.to(
                    () => ExteriorPhotosScreen(
                      mission: localMission,
                      reqId: widget.reqId,
                      existingPhotos: Map<String, String>.from(
                        inspection['exteriorPhotos'] ?? {},
                      ),
                      isDelivery: true,
                    ),
                  );
                  if (result != null) _calculateProgress();
                },
              ),
              if (type != 'HIRE_DRIVER') _buildInspectionItem(
                Icons.camera_alt_outlined,
                'Interior Photos at Delivery',
                'Take final interior photos',
                isCompleted: hasInterior,
                onTap: () async {
                  final result = await Get.to(
                    () => InteriorPhotosScreen(
                      mission: localMission,
                      reqId: widget.reqId,
                      existingPhotos: Map<String, String>.from(
                        inspection['interiorPhotos'] ?? {},
                      ),
                      isDelivery: true,
                    ),
                  );
                  if (result != null) _calculateProgress();
                },
              ),
              if (type != 'HIRE_DRIVER') _buildInspectionItem(
                Icons.description_outlined,
                'Delivery Damage Report',
                'Report any new damage at delivery',
                isCompleted: hasDamage,
                onTap: () async {
                  final result = await Get.to(
                    () => DamageReportScreen(
                      mission: localMission,
                      reqId: widget.reqId,
                      existingReport: inspection['damageReport'],
                      isDelivery: true,
                    ),
                  );
                  if (result != null) _calculateProgress();
                },
              ),
              _buildInspectionItem(
                Icons.speed_outlined,
                'Final Mileage & Fuel',
                'Enter final mileage and fuel level',
                isCompleted: hasMileage,
                onTap: () async {
                  final result = await Get.to(
                    () => MileageFuelScreen(
                      mission: localMission,
                      reqId: widget.reqId,
                      existingData: inspection['mileageAndFuel'],
                      isDelivery: true,
                    ),
                  );
                  if (result != null) _calculateProgress();
                },
              ),
              if (type != 'HIRE_DRIVER') _buildInspectionItem(
                Icons.description_outlined,
                'Upload Documents',
                'Upload PV or other documents here',
                isCompleted: hasDocuments,
                onTap: () async {
                  final result = await Get.to(
                    () => UploadDocumentsScreen(
                      mission: localMission,
                      reqId: widget.reqId,
                      existingDocuments: inspection['uploadDocuments'] ?? [],
                      isDelivery: true,
                    ),
                  );
                  if (result != null) _calculateProgress();
                },
              ),
              _buildInspectionItem(
                Icons.draw_outlined,
                'Receiver Signature',
                'Receiver confirms delivery condition',
                isCompleted: hasSignature,
                onTap: () async {
                  final result = await Get.to(
                    () => CustomerSignatureScreen(
                      mission: localMission,
                      reqId: widget.reqId,
                      existingSignature: inspection['customerSignature'],
                      isDelivery: true,
                    ),
                  );
                  if (result != null) _calculateProgress();
                },
              ),
              if (type == 'TRANSPORT') _buildInspectionItem(
                 Icons.badge_outlined,
                 'Receiver ID Verification',
                 'Verify Receiver ID',
                 isCompleted: hasReceiverId,
                 onTap: () async {
                   final result = await Get.to(
                     () => ReceiverIdVerificationScreen(
                       mission: localMission,
                       reqId: widget.reqId,
                       existingData: inspection['receiverIdVerification'],
                     ),
                   );
                   if (result != null) _calculateProgress();
                 },
               ),

              const Gap(height: 16),

              // Driver Selfie (Optional)
              const AppText(
                data: 'Driver Selfie (Optional)',
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 12),
              GestureDetector(
                onTap: () async {
                  final XFile? photo = await _picker.pickImage(
                    source: ImageSource.camera,
                    imageQuality: 80,
                  );
                  if (photo != null) {
                    setState(() {
                      driverSelfiePath = photo.path;
                      existingDriverSelfieUrl = null;
                    });
                  }
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFCBD5E1)),
                  ),
                  child: Center(
                    child: (driverSelfiePath != null || existingDriverSelfieUrl != null)
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: (driverSelfiePath != null)
                              ? (driverSelfiePath!.startsWith('http') || driverSelfiePath!.startsWith('blob:'))
                                  ? Image.network(driverSelfiePath!, height: 100, fit: BoxFit.cover)
                                  : Image.file(File(driverSelfiePath!), height: 100, fit: BoxFit.cover)
                              : Image.network(existingDriverSelfieUrl!, height: 100, fit: BoxFit.cover),
                        )
                      : Column(
                          children: const [
                            Icon(
                              Icons.camera_alt_outlined,
                              color: Color(0xFF94A3B8),
                              size: 28,
                            ),
                            Gap(height: 8),
                            AppText(
                              data: 'Take Driver Selfie',
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF334155),
                            ),
                            Gap(height: 4),
                            AppText(
                              data: 'Optional proof of delivery',
                              fontSize: 12,
                              color: Color(0xFF64748B),
                            ),
                          ],
                        ),
                  ),
                ),
              ),

              const Gap(height: 24),

              // Signature
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const AppText(
                    data: 'Driver Signature (Optional)',
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                  GestureDetector(
                    onTap: () {
                      _signatureController.clear();
                      setState(() {
                        existingDriverSignatureUrl = null;
                      });
                    },
                    child: Row(
                      children: const [
                        Icon(Icons.refresh, size: 14, color: Color(0xFF0EA5E9)),
                        Gap(width: 4),
                        AppText(
                          data: 'Clear',
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF0EA5E9),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const Gap(height: 12),
              Container(
                height: 150,
                padding: const EdgeInsets.symmetric(vertical: 24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFFCBD5E1),
                  ), // Usually Dashed in real app
                ),
                child: existingDriverSignatureUrl != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(existingDriverSignatureUrl!, fit: BoxFit.contain),
                      )
                    : Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: CustomPaint(
                              painter: DashedRectPainter(color: const Color(0xFF94A3B8)),
                              child: Signature(
                                controller: _signatureController,
                                height: 150,
                                backgroundColor: Colors.transparent,
                              ),
                            ),
                          ),
                          if (_signatureController.isEmpty)
                            IgnorePointer(
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: const [
                                    AppText(
                                      data: 'Tap to sign',
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF64748B),
                                    ),
                                    Gap(height: 4),
                                    AppText(
                                      data: 'Driver draws signature here',
                                      fontSize: 12,
                                      color: Color(0xFF94A3B8),
                                    ),
                                  ],
                                ),
                              ),
                            ),
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
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            onPressed: () async {
              if (completedCount < totalCount) {
                Get.snackbar(
                  'Incomplete',
                  'Please complete all $totalCount required sections before finishing.',
                  backgroundColor: const Color(0xFFF59E0B),
                  colorText: Colors.white,
                  snackPosition: SnackPosition.bottom,
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

                  if (driverSelfiePath != null) {
                    final bytes = await XFile(driverSelfiePath!).readAsBytes();
                    files.add(MultipartFile.fromBytes(bytes, filename: 'driver_selfie.jpg'));
                    labels.add('driverSelfiePhoto');
                  } else if (existingDriverSelfieUrl != null) {
                    uploadData['driverSelfiePhoto'] = existingDriverSelfieUrl;
                  }

                  if (_signatureController.isNotEmpty) {
                    final Uint8List? signatureBytes = await _signatureController.toPngBytes();
                    if (signatureBytes != null) {
                      files.add(MultipartFile.fromBytes(signatureBytes, filename: 'driver_sig.png'));
                      labels.add('driverSignaturePhoto');
                    }
                  } else if (existingDriverSignatureUrl != null) {
                    uploadData['driverSignaturePhoto'] = existingDriverSignatureUrl;
                  }

                  if (files.isNotEmpty) {
                    uploadData['image'] = files;
                    uploadData['imageLabels'] = labels;
                  }
                  
                  final res = await repo.updateDeliveryInspection(
                    widget.mission['_id'] ?? widget.reqId, 
                    'driverConfirmation', 
                    uploadData
                  );

                  if (mounted) Navigator.of(context).pop();
                  
                  if (res.statusCode == 200) {
                    if (localMission['details']['deliveryInspection'] == null) {
                      localMission['details']['deliveryInspection'] = <String, dynamic>{};
                    }
                    localMission['details']['deliveryInspection']['driverConfirmation'] = res.data['data']['details']['deliveryInspection']['driverConfirmation'];
                    
                    Get.snackbar(
                      'Success',
                      'Delivery inspection completed successfully!',
                      backgroundColor: const Color(0xFF10B981),
                      colorText: Colors.white,
                      snackPosition: SnackPosition.bottom,
                    );
                    
                    // Navigate to Mission Complete Screen
                    Get.off(() => MissionCompleteScreen(mission: localMission));
                  } else {
                    Get.snackbar('Error', 'Failed to complete mission');
                  }
                } catch (e) {
                  if (mounted) Navigator.of(context).pop();
                  Get.snackbar('Error', 'An error occurred while completing the mission.');
                }
            },
            child: Ink(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF3B82F6),
                    Color(0xFFA855F7),
                  ], // Blue to purple gradient
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Container(
                alignment: Alignment.center,
                child: const AppText(
                  data: 'Complete Mission',
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

  Widget _buildInspectionItem(
    IconData icon,
    String title,
    String subtitle, {
    bool isCompleted = false,
    VoidCallback? onTap,
  }) {
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
                  AppText(
                    data: title,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF0F172A),
                  ),
                  const Gap(height: 2),
                  AppText(
                    data: subtitle,
                    fontSize: 13,
                    color: const Color(0xFF64748B),
                  ),
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
                  color: isCompleted
                      ? const Color(0xFF10B981)
                      : const Color(0xFFCBD5E1),
                  width: 1.5,
                ),
              ),
              child: isCompleted
                  ? const Icon(Icons.check, size: 16, color: Color(0xFF10B981))
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

class DashedRectPainter extends CustomPainter {
  final Color color;
  DashedRectPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    var paint = Paint()
      ..color = color
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;
    
    var path = Path();
    path.addRRect(RRect.fromRectAndRadius(Rect.fromLTWH(0, 0, size.width, size.height), const Radius.circular(12)));
    
    const double dashWidth = 5;
    const double dashSpace = 5;
    double distance = 0;
    
    for (PathMetric pathMetric in path.computeMetrics()) {
      while (distance < pathMetric.length) {
        canvas.drawPath(pathMetric.extractPath(distance, distance + dashWidth), paint);
        distance += dashWidth + dashSpace;
      }
      distance = 0;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
