import 'dart:io';
import 'dart:ui';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:Vehiqqo/service/repository/mission_repository.dart';

class UploadDocumentsScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;
  final List<dynamic>? existingDocuments;
  final bool isDelivery;

  const UploadDocumentsScreen({
    super.key,
    required this.mission,
    required this.reqId,
    this.existingDocuments,
    this.isDelivery = false,
  });

  @override
  State<UploadDocumentsScreen> createState() => _UploadDocumentsScreenState();
}

class _UploadDocumentsScreenState extends State<UploadDocumentsScreen> {
  final ImagePicker _picker = ImagePicker();
  List<String> uploadedDocuments = [];

  @override
  void initState() {
    super.initState();
    if (widget.existingDocuments != null) {
      uploadedDocuments = widget.existingDocuments!
          .map((e) => e.toString())
          .toList();
    }
  }

  Future<void> _pickDocument(ImageSource source) async {
    final XFile? photo = await _picker.pickImage(source: source);
    if (photo != null) {
      setState(() {
        uploadedDocuments.add(photo.path);
      });
    }
  }

  void _removeDocument(int index) {
    setState(() {
      uploadedDocuments.removeAt(index);
    });
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
                data: widget.isDelivery
                    ? 'Delivery Upload Documents'
                    : 'Upload Documents',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              const AppText(
                data: 'Upload PV or other documents here',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF64748B),
              ),
              const Gap(height: 24),

              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: const AppText(
                        data: 'Upload Document',
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),

                    GestureDetector(
                      onTap: () => _pickDocument(ImageSource.gallery),
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 16),
                        padding: const EdgeInsets.symmetric(vertical: 32),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: const Color(0xFFCBD5E1),
                            style: BorderStyle.none,
                          ),
                        ),
                        child: CustomPaint(
                          painter: DashedRectPainter(
                            color: const Color(0xFF94A3B8),
                          ),
                          child: Column(
                            children: const [
                              Icon(
                                Icons.insert_drive_file_outlined,
                                color: Color(0xFF64748B),
                                size: 36,
                              ),
                              Gap(height: 12),
                              AppText(
                                data: 'Drop document here',
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF334155),
                              ),
                              Gap(height: 4),
                              AppText(
                                data:
                                    'Upload PV or any\nother\nrequired document.',
                                fontSize: 13,
                                color: Color(0xFF94A3B8),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const Gap(height: 16),

                    _buildOptionCard(
                      icon: Icons.camera_alt_outlined,
                      title: 'Scan Document',
                      subtitle:
                          'Take a picture directly from the app.\nThe document will be scanned and\ncropped automatically.',
                      onTap: () => _pickDocument(ImageSource.camera),
                      isBlue: true,
                    ),

                    _buildOptionCard(
                      icon: Icons.folder_open_outlined,
                      title: 'Upload from Files',
                      subtitle: 'Choose a file from your device.',
                      onTap: () => _pickDocument(ImageSource.gallery),
                      isBlue: false,
                    ),
                    const Gap(height: 16),
                  ],
                ),
              ),

              if (uploadedDocuments.isNotEmpty) ...[
                const Gap(height: 24),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      AppText(
                        data:
                            'Uploaded Documents (${uploadedDocuments.length})',
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF0F172A),
                      ),
                      const Gap(height: 12),
                      ...List.generate(uploadedDocuments.length, (index) {
                        return _buildDocumentItem(
                          uploadedDocuments[index],
                          index,
                        );
                      }),
                    ],
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
              if (uploadedDocuments.isEmpty) {
                Get.snackbar(
                  'Required',
                  'Please upload at least one document',
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
                final List<String> existingDocs = [];
                final List<String> labels = [];

                for (int i = 0; i < uploadedDocuments.length; i++) {
                  String path = uploadedDocuments[i];
                  if (path.startsWith('http') &&
                      !path.startsWith('blob:http')) {
                    existingDocs.add(path);
                  } else {
                    final bytes = await FlutterImageCompress.compressWithFile(
                      path,
                      minWidth: 800,
                      minHeight: 800,
                      quality: 70,
                    );
                    if (bytes != null) {
                      files.add(
                        MultipartFile.fromBytes(
                          bytes,
                          filename: 'document_$i.jpg',
                        ),
                      );
                      labels.add('document');
                    }
                  }
                }

                uploadData['existingDocuments'] = existingDocs;
                if (files.isNotEmpty) {
                  uploadData['image'] = files;
                  uploadData['imageLabels'] = labels;
                }

                Response res;
                if (widget.isDelivery) {
                  res = await repo.updateDeliveryInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'uploadDocuments',
                    uploadData,
                  );
                } else {
                  res = await repo.updatePickupInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'uploadDocuments',
                    uploadData,
                  );
                }

                if (mounted) Navigator.of(context).pop();

                if (res.statusCode == 200) {
                  final inspectionKey = widget.isDelivery
                      ? 'deliveryInspection'
                      : 'pickupInspection';
                  if (widget.mission['details'][inspectionKey] == null) {
                    widget.mission['details'][inspectionKey] =
                        <String, dynamic>{};
                  }
                  final savedData = res
                      .data['data']['details'][inspectionKey]['uploadDocuments'];
                  widget.mission['details'][inspectionKey]['uploadDocuments'] =
                      savedData;

                  if (mounted) Navigator.of(context).pop(savedData);
                } else {
                  Get.snackbar('Error', 'Failed to save documents');
                }
              } catch (e) {
                if (mounted) Navigator.of(context).pop();
                Get.snackbar('Error', 'Network error while saving documents');
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
                  data: 'Save Documents',
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

  Widget _buildOptionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    required bool isBlue,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isBlue ? const Color(0xFFEFF6FF) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isBlue ? const Color(0xFFBFDBFE) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isBlue
                      ? const Color(0xFFBFDBFE)
                      : const Color(0xFFE2E8F0),
                ),
              ),
              child: Icon(
                icon,
                color: isBlue
                    ? const Color(0xFF2563EB)
                    : const Color(0xFF475569),
                size: 20,
              ),
            ),
            const Gap(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppText(
                    data: title,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: isBlue
                        ? const Color(0xFF1D4ED8)
                        : const Color(0xFF0F172A),
                  ),
                  const Gap(height: 2),
                  AppText(
                    data: subtitle,
                    fontSize: 12,
                    color: const Color(0xFF64748B),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: isBlue ? const Color(0xFF2563EB) : const Color(0xFF94A3B8),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDocumentItem(String path, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.insert_drive_file,
            color: Color(0xFF475569),
            size: 24,
          ),
          const Gap(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppText(
                  data: 'Document_${index + 1}.jpg',
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF0F172A),
                ),
                const Gap(height: 2),
                const AppText(
                  data: 'Uploaded just now',
                  fontSize: 12,
                  color: Color(0xFF64748B),
                ),
              ],
            ),
          ),
          const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 20),
          const Gap(width: 8),
          GestureDetector(
            onTap: () => _removeDocument(index),
            child: const Icon(
              Icons.more_vert,
              color: Color(0xFF475569),
              size: 20,
            ),
          ),
        ],
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
    path.addRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(0, 0, size.width, size.height),
        const Radius.circular(12),
      ),
    );

    // Simple dash effect
    const double dashWidth = 5;
    const double dashSpace = 5;
    double distance = 0;

    for (PathMetric pathMetric in path.computeMetrics()) {
      while (distance < pathMetric.length) {
        canvas.drawPath(
          pathMetric.extractPath(distance, distance + dashWidth),
          paint,
        );
        distance += dashWidth + dashSpace;
      }
      distance = 0; // Reset for next path if any
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
