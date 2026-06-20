import 'dart:io';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';

class DamageReportScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;
  final Map<String, dynamic>? existingReport;
  final bool isDelivery;

  const DamageReportScreen({
    super.key,
    required this.mission,
    required this.reqId,
    this.existingReport,
    this.isDelivery = false,
  });

  @override
  State<DamageReportScreen> createState() => _DamageReportScreenState();
}

class _DamageReportScreenState extends State<DamageReportScreen> {
  String? damageStatus;
  String? damagedComponent;
  final TextEditingController _commentController = TextEditingController();
  String? damagePhoto;

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    if (widget.existingReport != null) {
      damageStatus = widget.existingReport!['status'];
      damagedComponent = widget.existingReport!['component'];
      _commentController.text = widget.existingReport!['comment'] ?? '';
      damagePhoto = widget.existingReport!['photo'];
    }
  }

  Future<void> _takePhoto() async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        damagePhoto = photo.path;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    bool hasDamage = damageStatus == 'Damage found';

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
                data: widget.isDelivery ? 'Delivery Damage Report' : 'Damage Report',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              const AppText(
                data: 'Document any vehicle damage',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color(0xFF64748B),
              ),
              const Gap(height: 24),
              
              // Damage Status
              _buildSectionTitle('Damage Status'),
              const Gap(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    _buildRadioOption('No damage detected', damageStatus, (val) {
                      setState(() {
                        damageStatus = val;
                        damagedComponent = null;
                        damagePhoto = null;
                      });
                    }),
                    const Divider(height: 1, color: Color(0xFFE2E8F0)),
                    _buildRadioOption('Damage found', damageStatus, (val) {
                      setState(() => damageStatus = val);
                    }, isDanger: true),
                  ],
                ),
              ),
              
              if (hasDamage) ...[
                const Gap(height: 24),
                _buildSectionTitle('Damaged Component'),
                const Gap(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      _buildRadioOption('Bumper', damagedComponent, (val) => setState(() => damagedComponent = val)),
                      const Divider(height: 1, color: Color(0xFFE2E8F0)),
                      _buildRadioOption('Bonnet', damagedComponent, (val) => setState(() => damagedComponent = val)),
                      const Divider(height: 1, color: Color(0xFFE2E8F0)),
                      _buildRadioOption('Right-hand light unit', damagedComponent, (val) => setState(() => damagedComponent = val)),
                      const Divider(height: 1, color: Color(0xFFE2E8F0)),
                      _buildRadioOption('Left-hand light unit', damagedComponent, (val) => setState(() => damagedComponent = val)),
                      const Divider(height: 1, color: Color(0xFFE2E8F0)),
                      _buildRadioOption('Door', damagedComponent, (val) => setState(() => damagedComponent = val)),
                    ],
                  ),
                ),
                
                const Gap(height: 24),
                _buildSectionTitle('Comment'),
                const Gap(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: TextField(
                    controller: _commentController,
                    maxLines: 4,
                    decoration: const InputDecoration(
                      hintText: 'Describe the damage in detail...',
                      hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.all(16),
                    ),
                  ),
                ),

                const Gap(height: 24),
                _buildSectionTitle('Damage Photo'),
                const Gap(height: 12),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      GestureDetector(
                        onTap: _takePhoto,
                        child: Container(
                          height: 120,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: damagePhoto != null ? Colors.transparent : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(12),
                            image: damagePhoto != null ? DecorationImage(
                              image: damagePhoto!.startsWith('http') || damagePhoto!.startsWith('blob:')
                                  ? NetworkImage(damagePhoto!) as ImageProvider
                                  : FileImage(File(damagePhoto!)),
                              fit: BoxFit.cover,
                            ) : null,
                          ),
                          child: damagePhoto != null ? null : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.camera_alt_outlined, color: Color(0xFF64748B), size: 32),
                              Gap(height: 8),
                              AppText(data: 'Take Damage Photo', color: Color(0xFF64748B), fontSize: 14),
                            ],
                          ),
                        ),
                      ),
                      if (damagePhoto == null) ...[
                        const Gap(height: 16),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFFBEB),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFFDE68A)),
                          ),
                          child: Row(
                            children: const [
                              Icon(Icons.info_outline, color: Color(0xFFD97706), size: 20),
                              Gap(width: 8),
                              AppText(data: 'Please take a photo to confirm the damage', color: Color(0xFFB45309), fontSize: 12),
                            ],
                          ),
                        ),
                      ],
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
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            onPressed: () async {
              if (damageStatus == null) {
                Get.snackbar('Required', 'Please select damage status', backgroundColor: Colors.red.withOpacity(0.9), colorText: Colors.white, snackPosition: SnackPosition.bottom, margin: const EdgeInsets.all(20));
                return;
              }
              if (hasDamage && damagedComponent == null) {
                Get.snackbar('Required', 'Please select damaged component', backgroundColor: Colors.red.withOpacity(0.9), colorText: Colors.white, snackPosition: SnackPosition.bottom, margin: const EdgeInsets.all(20));
                return;
              }
              if (hasDamage && damagePhoto == null) {
                Get.snackbar('Required', 'Please capture damage photo', backgroundColor: Colors.red.withOpacity(0.9), colorText: Colors.white, snackPosition: SnackPosition.bottom, margin: const EdgeInsets.all(20));
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
                  'status': damageStatus,
                  'component': damagedComponent,
                  'comment': _commentController.text,
                };

                bool isNetworkImage = damagePhoto != null && damagePhoto!.startsWith('http') && !damagePhoto!.startsWith('blob:http');
                
                if (hasDamage && damagePhoto != null && !isNetworkImage) {
                  final bytes = await XFile(damagePhoto!).readAsBytes();
                  uploadData['image'] = [MultipartFile.fromBytes(bytes, filename: 'damage.jpg')];
                  uploadData['imageLabels'] = ['damagePhoto'];
                } else if (hasDamage && damagePhoto != null) {
                  uploadData['photo'] = damagePhoto;
                }
                
                Response res;
                if (widget.isDelivery) {
                  res = await repo.updateDeliveryInspection(
                    widget.mission['_id'] ?? widget.reqId, 
                    'damageReport', 
                    uploadData
                  );
                } else {
                  res = await repo.updatePickupInspection(
                    widget.mission['_id'] ?? widget.reqId, 
                    'damageReport', 
                    uploadData
                  );
                }

                if (mounted) Navigator.of(context).pop();
                
                if (res.statusCode == 200) {
                  final inspectionKey = widget.isDelivery ? 'deliveryInspection' : 'pickupInspection';
                  if (widget.mission['details'][inspectionKey] == null) {
                    widget.mission['details'][inspectionKey] = <String, dynamic>{};
                  }
                  final savedData = res.data['data']['details'][inspectionKey]['damageReport'];
                  widget.mission['details'][inspectionKey]['damageReport'] = savedData;

                  if (mounted) Navigator.of(context).pop(savedData);
                } else {
                  Get.snackbar('Error', 'Failed to save report');
                }
              } catch (e) {
                if (mounted) Navigator.of(context).pop();
                Get.snackbar('Error', 'Network error while saving report');
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
                child: const AppText(data: 'Save', color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
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

  Widget _buildRadioOption(String label, String? groupValue, ValueChanged<String?> onChanged, {bool isDanger = false}) {
    bool isSelected = label == groupValue;
    return InkWell(
      onTap: () => onChanged(label),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: isSelected && isDanger ? BoxDecoration(
          color: const Color(0xFFFEF2F2),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFEF4444)),
        ) : null,
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected 
                      ? (isDanger ? const Color(0xFFEF4444) : const Color(0xFF2563EB))
                      : const Color(0xFFCBD5E1),
                  width: isSelected ? 6 : 1,
                ),
              ),
            ),
            const Gap(width: 12),
            AppText(
              data: label, 
              fontSize: 14, 
              color: isSelected && isDanger ? const Color(0xFFB91C1C) : const Color(0xFF334155),
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ],
        ),
      ),
    );
  }
}
