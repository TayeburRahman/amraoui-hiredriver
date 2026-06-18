import 'dart:io';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';

class ReceiverIdVerificationScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;
  final Map<String, dynamic>? existingData;

  const ReceiverIdVerificationScreen({
    super.key,
    required this.mission,
    required this.reqId,
    this.existingData,
  });

  @override
  State<ReceiverIdVerificationScreen> createState() => _ReceiverIdVerificationScreenState();
}

class _ReceiverIdVerificationScreenState extends State<ReceiverIdVerificationScreen> {
  final ImagePicker _picker = ImagePicker();
  
  String? idFrontPath;
  String? existingIdFrontUrl;

  String? idBackPath;
  String? existingIdBackUrl;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _idNumberController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.existingData != null) {
      existingIdFrontUrl = widget.existingData!['idFront'];
      existingIdBackUrl = widget.existingData!['idBack'];
      _nameController.text = widget.existingData!['receiverFullName'] ?? '';
      _idNumberController.text = widget.existingData!['idNumber'] ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _idNumberController.dispose();
    super.dispose();
  }

  Future<void> _takePhoto(bool isFront) async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
      );
      if (photo != null) {
        setState(() {
          if (isFront) {
            idFrontPath = photo.path;
            existingIdFrontUrl = null;
          } else {
            idBackPath = photo.path;
            existingIdBackUrl = null;
          }
        });
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to take photo.');
    }
  }

  Widget _buildImagePreview(String? path, String? url) {
    if (path != null) {
      return (path.startsWith('http') || path.startsWith('blob:'))
          ? Image.network(path, height: 120, fit: BoxFit.cover)
          : Image.file(File(path), height: 120, fit: BoxFit.cover);
    } else if (url != null) {
      return Image.network(url, height: 120, fit: BoxFit.cover);
    }
    return const SizedBox.shrink();
  }

  @override
  Widget build(BuildContext context) {
    bool hasFront = idFrontPath != null || existingIdFrontUrl != null;
    bool hasBack = idBackPath != null || existingIdBackUrl != null;
    bool hasAnyId = hasFront || hasBack;

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
                data: 'Scan Receiver ID',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              const AppText(
                data: 'Verify the person receiving the vehicle.',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF64748B),
              ),
              const Gap(height: 12),
              Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF7ED),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const AppText(
                    data: 'ID Check Required',
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFEA580C),
                  ),
                ),
              ),
              const Gap(height: 24),
              
              // Mission Reference Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.assignment_outlined, color: Color(0xFF3B82F6), size: 20),
                    ),
                    const Gap(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const AppText(
                            data: 'Mission Reference',
                            fontSize: 12,
                            color: Color(0xFF64748B),
                          ),
                          AppText(
                            data: widget.mission['missionReference'] ?? '#MS-Unknown',
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF0F172A),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const AppText(
                        data: 'Pending',
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFD97706),
                      ),
                    ),
                  ],
                ),
              ),
              const Gap(height: 24),

              // Receiver ID Document section
              const AppText(
                data: 'Receiver ID Document',
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              const AppText(
                data: 'Scan the ID card of the person receiving the car. Make sure the document is clear and readable.',
                fontSize: 13,
                color: Color(0xFF64748B),
              ),
              const Gap(height: 16),

              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFCBD5E1)), // Dashed normally
                ),
                child: hasAnyId ? Row(
                  children: [
                    if (hasFront) Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: _buildImagePreview(idFrontPath, existingIdFrontUrl),
                      ),
                    ),
                    if (hasFront && hasBack) const Gap(width: 12),
                    if (hasBack) Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: _buildImagePreview(idBackPath, existingIdBackUrl),
                      ),
                    ),
                  ],
                ) : Center(
                  child: Column(
                    children: const [
                      Icon(Icons.badge_outlined, color: Color(0xFF94A3B8), size: 32),
                      Gap(height: 8),
                      AppText(
                        data: 'No ID scanned yet',
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF0F172A),
                      ),
                      Gap(height: 4),
                      AppText(
                        data: 'Take a photo or scan the ID document',
                        fontSize: 12,
                        color: Color(0xFF64748B),
                      ),
                    ],
                  ),
                ),
              ),
              const Gap(height: 16),

              // Scan Buttons
              _buildScanButton(
                title: 'Scan ID Document (Front Side)',
                subtitle: 'Open camera and auto-crop the ID card.',
                isDone: hasFront,
                onTap: () => _takePhoto(true),
              ),
              const Gap(height: 12),
              _buildScanButton(
                title: 'Scan ID Document (Back Side)',
                subtitle: 'Open camera and auto-crop the ID card.',
                isDone: hasBack,
                onTap: () => _takePhoto(false),
              ),
              const Gap(height: 24),

              // Receiver Details Section
              const AppText(
                data: 'Receiver Details',
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 16),
              const AppText(
                data: 'Receiver Full Name',
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF334155),
              ),
              const Gap(height: 8),
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  hintText: 'Enter receiver name',
                  hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF3B82F6)),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
              ),
              const Gap(height: 16),
              const AppText(
                data: 'ID Number',
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF334155),
              ),
              const Gap(height: 8),
              TextField(
                controller: _idNumberController,
                decoration: InputDecoration(
                  hintText: 'Enter ID number',
                  hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF3B82F6)),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
              ),
              const Gap(height: 16),
              
              // Info Box
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4), // Light green
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.shield_outlined, color: Color(0xFF16A34A), size: 20),
                    Gap(width: 12),
                    Expanded(
                      child: AppText(
                        data: 'This ID will be saved with the mission record for verification.',
                        fontSize: 13,
                        color: Color(0xFF16A34A),
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
              if (_nameController.text.trim().isEmpty || _idNumberController.text.trim().isEmpty) {
                Get.snackbar('Required', 'Please enter both receiver name and ID number');
                return;
              }

              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (BuildContext context) => const Center(child: CircularProgressIndicator()),
              );

              try {
                final repo = MissionRepository();
                final Map<String, dynamic> uploadData = {
                  'receiverFullName': _nameController.text.trim(),
                  'idNumber': _idNumberController.text.trim(),
                };
                
                final List<MultipartFile> files = [];
                final List<String> labels = [];

                if (idFrontPath != null) {
                  final bytes = await XFile(idFrontPath!).readAsBytes();
                  files.add(MultipartFile.fromBytes(bytes, filename: 'id_front.jpg'));
                  labels.add('idFront');
                } else if (existingIdFrontUrl != null) {
                  uploadData['idFront'] = existingIdFrontUrl;
                }

                if (idBackPath != null) {
                  final bytes = await XFile(idBackPath!).readAsBytes();
                  files.add(MultipartFile.fromBytes(bytes, filename: 'id_back.jpg'));
                  labels.add('idBack');
                } else if (existingIdBackUrl != null) {
                  uploadData['idBack'] = existingIdBackUrl;
                }

                if (files.isNotEmpty) {
                  uploadData['image'] = files;
                  uploadData['imageLabels'] = labels;
                }
                
                final res = await repo.updateDeliveryInspection(
                  widget.mission['_id'] ?? widget.reqId, 
                  'receiverIdVerification', 
                  uploadData
                );

                if (mounted) {
                  Navigator.of(context).pop();
                }
                
                if (res.statusCode == 200) {
                  final inspectionKey = 'deliveryInspection';
                  if (widget.mission['details'][inspectionKey] == null) {
                    widget.mission['details'][inspectionKey] = <String, dynamic>{};
                  }
                  widget.mission['details'][inspectionKey]['receiverIdVerification'] = res.data['data']['details'][inspectionKey]['receiverIdVerification'];

                  if (mounted) {
                    Navigator.of(context).pop(res.data['data']['details'][inspectionKey]['receiverIdVerification']);
                  }
                } else {
                  Get.snackbar('Error', 'Failed to save verification data');
                }
              } catch (e) {
                if (mounted) {
                  Navigator.of(context).pop();
                }
                Get.snackbar('Error', 'An error occurred while saving.');
              }
            },
            child: Ink(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF8B5CF6), // Purple
                    Color(0xFF6366F1), // Indigo
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Container(
                alignment: Alignment.center,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.check, color: Colors.white, size: 18),
                    Gap(width: 8),
                    AppText(
                      data: 'Save ID Verification',
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScanButton({
    required String title,
    required String subtitle,
    required bool isDone,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isDone ? const Color(0xFFF0FDF4) : const Color(0xFFEFF6FF), // Light blue vs light green
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isDone ? const Color(0xFF10B981) : const Color(0xFFBFDBFE)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Icon(
                isDone ? Icons.check : Icons.camera_alt_outlined, 
                color: isDone ? const Color(0xFF10B981) : const Color(0xFF3B82F6), 
                size: 20
              ),
            ),
            const Gap(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppText(
                    data: title,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: isDone ? const Color(0xFF0F172A) : const Color(0xFF1D4ED8),
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
            Icon(Icons.chevron_right, color: isDone ? const Color(0xFF10B981) : const Color(0xFF3B82F6)),
          ],
        ),
      ),
    );
  }
}
