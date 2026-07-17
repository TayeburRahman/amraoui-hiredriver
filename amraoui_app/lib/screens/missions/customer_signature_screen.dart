import 'dart:io';
import 'dart:ui';
import 'dart:typed_data';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:signature/signature.dart';
import 'package:dio/dio.dart';
import 'package:Vehiqqo/service/repository/mission_repository.dart';
import 'package:path_provider/path_provider.dart';
import 'package:Vehiqqo/widgets/signature/full_screen_signature.dart';

class CustomerSignatureScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;
  final Map<String, dynamic>? existingSignature;
  final bool isDelivery;

  const CustomerSignatureScreen({
    super.key,
    required this.mission,
    required this.reqId,
    this.existingSignature,
    this.isDelivery = false,
  });

  @override
  State<CustomerSignatureScreen> createState() =>
      _CustomerSignatureScreenState();
}

class _CustomerSignatureScreenState extends State<CustomerSignatureScreen> {
  final TextEditingController _nameController = TextEditingController();
  final SignatureController _signatureController = SignatureController(
    penStrokeWidth: 3,
    penColor: Colors.black,
    exportBackgroundColor: Colors.white,
  );

  String? savedSignatureUrl;

  @override
  void initState() {
    super.initState();
    if (widget.existingSignature != null) {
      _nameController.text = widget.existingSignature!['customerName'] ?? '';
      savedSignatureUrl = widget.existingSignature!['signaturePhoto'];
    }
  }

  @override
  void dispose() {
    _signatureController.dispose();
    _nameController.dispose();
    super.dispose();
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
                    ? 'Receiver Signature'
                    : 'Customer Signature',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              AppText(
                data: widget.isDelivery
                    ? 'Get receiver confirmation'
                    : 'Get customer confirmation',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF64748B),
              ),
              const Gap(height: 24),

              // Customer Name
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
                      padding: const EdgeInsets.only(
                        left: 16,
                        top: 16,
                        right: 16,
                      ),
                      child: AppText(
                        data: widget.isDelivery
                            ? 'Receiver Name'
                            : 'Customer Name',
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: TextField(
                          controller: _nameController,
                          decoration: InputDecoration(
                            hintText: widget.isDelivery
                                ? 'Enter receiver full name'
                                : 'Enter customer full name',
                            hintStyle: const TextStyle(
                              color: Color(0xFF94A3B8),
                              fontSize: 14,
                            ),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const Gap(height: 8),
                  ],
                ),
              ),

              const Gap(height: 24),

              // Signature Pad
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
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const AppText(
                            data: 'Signature',
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                          GestureDetector(
                            onTap: () {
                              _signatureController.clear();
                              setState(() {
                                savedSignatureUrl = null;
                              });
                            },
                            child: Row(
                              children: const [
                                Icon(
                                  Icons.refresh,
                                  color: Color(0xFF06B6D4),
                                  size: 16,
                                ),
                                Gap(width: 4),
                                AppText(
                                  data: 'Clear',
                                  color: Color(0xFF06B6D4),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    GestureDetector(
                      onTap: () async {
                        final List<Point>? points = await Get.to(
                          () => FullScreenSignature(
                            title: widget.isDelivery
                                ? 'Receiver Signature'
                                : 'Customer Signature',
                          ),
                        );
                        if (points != null && points.isNotEmpty) {
                          setState(() {
                            _signatureController.points = points;
                            savedSignatureUrl = null;
                          });
                        }
                      },
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 16),
                        height: 200,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: const Color(0xFFCBD5E1),
                            style: BorderStyle.none,
                          ),
                        ),
                        child: savedSignatureUrl != null
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Image.network(
                                  savedSignatureUrl!,
                                  fit: BoxFit.contain,
                                ),
                              )
                            : Stack(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: CustomPaint(
                                      painter: DashedRectPainter(
                                        color: const Color(0xFF94A3B8),
                                      ),
                                      child: IgnorePointer(
                                        child: Signature(
                                          controller: _signatureController,
                                          height: 200,
                                          backgroundColor: Colors.transparent,
                                        ),
                                      ),
                                    ),
                                  ),
                                  if (_signatureController.isEmpty)
                                    IgnorePointer(
                                      child: Center(
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            const AppText(
                                              data: 'Tap to sign',
                                              fontSize: 15,
                                              fontWeight: FontWeight.bold,
                                              color: Color(0xFF94A3B8),
                                            ),
                                            const Gap(height: 4),
                                            AppText(
                                              data: widget.isDelivery
                                                  ? 'Receiver draws signature here'
                                                  : 'Customer draws signature here',
                                              fontSize: 13,
                                              color: const Color(0xFFCBD5E1),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                      ),
                    ),
                    const Gap(height: 16),
                  ],
                ),
              ),

              const Gap(height: 24),
              Container(
                padding: const EdgeInsets.symmetric(
                  vertical: 16,
                  horizontal: 16,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: AppText(
                  data: widget.isDelivery
                      ? 'Receiver confirms vehicle condition at delivery.'
                      : 'Customer confirms vehicle condition at pickup.',
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF1E3A8A),
                  textAlign: TextAlign.center,
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
              if (_nameController.text.isEmpty) {
                Get.snackbar(
                  'Required',
                  widget.isDelivery
                      ? 'Please enter receiver name'
                      : 'Please enter customer name',
                  backgroundColor: Colors.red.withOpacity(0.9),
                  colorText: Colors.white,
                  snackPosition: SnackPosition.bottom,
                  margin: const EdgeInsets.all(20),
                );
                return;
              }
              if (_signatureController.isEmpty && savedSignatureUrl == null) {
                Get.snackbar(
                  'Required',
                  'Please provide a signature',
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
                final Map<String, dynamic> uploadData = {
                  'customerName': _nameController.text,
                };

                final List<MultipartFile> files = [];
                final List<String> labels = [];

                if (_signatureController.isNotEmpty) {
                  final Uint8List? signatureBytes = await _signatureController
                      .toPngBytes();
                  if (signatureBytes != null) {
                    files.add(
                      MultipartFile.fromBytes(
                        signatureBytes,
                        filename: 'signature.png',
                      ),
                    );
                    labels.add('signaturePhoto');
                  }
                } else if (savedSignatureUrl != null) {
                  uploadData['signaturePhoto'] = savedSignatureUrl;
                }

                if (files.isNotEmpty) {
                  uploadData['image'] = files;
                  uploadData['imageLabels'] = labels;
                }

                Response res;
                if (widget.isDelivery) {
                  res = await repo.updateDeliveryInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'customerSignature',
                    uploadData,
                  );
                } else {
                  res = await repo.updatePickupInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'customerSignature',
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
                      .data['data']['details'][inspectionKey]['customerSignature'];
                  widget.mission['details'][inspectionKey]['customerSignature'] =
                      savedData;

                  if (mounted) Navigator.of(context).pop(savedData);
                } else {
                  Get.snackbar('Error', 'Failed to save signature');
                }
              } catch (e) {
                if (mounted) Navigator.of(context).pop();
                Get.snackbar('Error', 'Network error while saving signature');
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
                  data: 'Save Signature',
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
      distance = 0;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
