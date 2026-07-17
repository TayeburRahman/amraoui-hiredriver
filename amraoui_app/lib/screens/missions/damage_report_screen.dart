import 'dart:io';
import 'dart:convert';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart' hide MultipartFile, FormData, Response;
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:Vehiqqo/service/repository/mission_repository.dart';

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
  List<Map<String, dynamic>> damagesList = [];

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    if (widget.existingReport != null) {
      damageStatus = widget.existingReport!['status'];

      if (widget.existingReport!['damagesList'] != null) {
        damagesList = List<Map<String, dynamic>>.from(
          widget.existingReport!['damagesList'],
        );
      } else if (widget.existingReport!['component'] != null) {
        // Fallback for older single damage records
        damagesList.add({
          'component': widget.existingReport!['component'],
          'condition': widget.existingReport!['condition'],
          'comment': widget.existingReport!['comment'] ?? '',
          'photo': widget.existingReport!['photo'],
        });
      }
    }
  }

  void _openAddDamageSheet() {
    String? tempComponent;
    String? tempCondition;
    String? tempPhoto;
    final TextEditingController tempCommentController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            Future<void> takeSheetPhoto() async {
              final XFile? photo = await _picker.pickImage(
                source: ImageSource.camera,
              );
              if (photo != null) {
                setSheetState(() => tempPhoto = photo.path);
              }
            }

            return Container(
              height: MediaQuery.of(context).size.height * 0.9,
              decoration: const BoxDecoration(
                color: Color(0xFFF8FAFC),
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  // Handle bar
                  Container(
                    margin: const EdgeInsets.only(top: 12, bottom: 12),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: AppText(
                      data: 'Add Damage Details',
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const Gap(height: 16),
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _buildSectionTitle('Which component is damaged?'),
                          const Gap(height: 8),
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: Column(
                              children: [
                                _buildSheetRadio(
                                  'Bumper',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Bonnet',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Right-hand light unit',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Left-hand light unit',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Door',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Windshield',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Tire',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Other',
                                  tempComponent,
                                  (val) =>
                                      setSheetState(() => tempComponent = val),
                                ),
                              ],
                            ),
                          ),
                          const Gap(height: 24),

                          _buildSectionTitle('Condition of the component'),
                          const Gap(height: 8),
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: Column(
                              children: [
                                _buildSheetRadio(
                                  'Scratch',
                                  tempCondition,
                                  (val) =>
                                      setSheetState(() => tempCondition = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Impact',
                                  tempCondition,
                                  (val) =>
                                      setSheetState(() => tempCondition = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Paintwork chipped',
                                  tempCondition,
                                  (val) =>
                                      setSheetState(() => tempCondition = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Broken',
                                  tempCondition,
                                  (val) =>
                                      setSheetState(() => tempCondition = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Dirty',
                                  tempCondition,
                                  (val) =>
                                      setSheetState(() => tempCondition = val),
                                ),
                                const Divider(
                                  height: 1,
                                  color: Color(0xFFE2E8F0),
                                ),
                                _buildSheetRadio(
                                  'Other',
                                  tempCondition,
                                  (val) =>
                                      setSheetState(() => tempCondition = val),
                                ),
                              ],
                            ),
                          ),
                          const Gap(height: 24),

                          _buildSectionTitle('Comment (Optional)'),
                          const Gap(height: 8),
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: TextField(
                              controller: tempCommentController,
                              maxLines: 3,
                              decoration: const InputDecoration(
                                hintText: 'Describe the damage...',
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.all(16),
                              ),
                            ),
                          ),
                          const Gap(height: 24),

                          _buildSectionTitle('Damage Photo'),
                          const Gap(height: 8),
                          GestureDetector(
                            onTap: takeSheetPhoto,
                            child: Container(
                              height: 140,
                              width: double.infinity,
                              decoration: BoxDecoration(
                                color: tempPhoto != null
                                    ? Colors.transparent
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: const Color(0xFFE2E8F0),
                                ),
                                image: tempPhoto != null
                                    ? DecorationImage(
                                        image:
                                            tempPhoto!.startsWith('http') ||
                                                tempPhoto!.startsWith('blob:')
                                            ? NetworkImage(tempPhoto!)
                                                  as ImageProvider
                                            : FileImage(File(tempPhoto!)),
                                        fit: BoxFit.cover,
                                      )
                                    : null,
                              ),
                              child: tempPhoto == null
                                  ? Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: const [
                                        Icon(
                                          Icons.camera_alt_outlined,
                                          color: Color(0xFF64748B),
                                          size: 32,
                                        ),
                                        Gap(height: 8),
                                        AppText(
                                          data: 'Take Photo',
                                          color: Color(0xFF64748B),
                                          fontSize: 14,
                                        ),
                                      ],
                                    )
                                  : null,
                            ),
                          ),
                          const Gap(height: 40),
                        ],
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () {
                          if (tempComponent == null) {
                            Get.snackbar(
                              'Required',
                              'Please select component',
                              backgroundColor: Colors.red,
                            );
                            return;
                          }
                          if (tempCondition == null) {
                            Get.snackbar(
                              'Required',
                              'Please select condition',
                              backgroundColor: Colors.red,
                            );
                            return;
                          }
                          if (tempPhoto == null) {
                            Get.snackbar(
                              'Required',
                              'Please take a photo',
                              backgroundColor: Colors.red,
                            );
                            return;
                          }

                          setState(() {
                            damagesList.add({
                              'component': tempComponent,
                              'condition': tempCondition,
                              'comment': tempCommentController.text,
                              'photo': tempPhoto,
                            });
                          });
                          Navigator.pop(context);
                        },
                        child: const AppText(
                          data: 'Save Damage',
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
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
                data: widget.isDelivery
                    ? 'Delivery Damage Report'
                    : 'Damage Report',
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
                    _buildRadioOption('No damage detected', damageStatus, (
                      val,
                    ) {
                      setState(() {
                        damageStatus = val;
                        damagesList.clear(); // Clear all damages if no damage
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildSectionTitle('Reported Damages'),
                    TextButton.icon(
                      onPressed: _openAddDamageSheet,
                      icon: const Icon(
                        Icons.add_circle,
                        color: Color(0xFF2563EB),
                        size: 20,
                      ),
                      label: const AppText(
                        data: 'Add',
                        color: Color(0xFF2563EB),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const Gap(height: 12),

                if (damagesList.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFFBEB),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFFDE68A)),
                    ),
                    child: Column(
                      children: [
                        const Icon(
                          Icons.car_crash,
                          color: Color(0xFFD97706),
                          size: 48,
                        ),
                        const Gap(height: 12),
                        const AppText(
                          data: 'No damages added yet.',
                          color: Color(0xFF92400E),
                          fontWeight: FontWeight.bold,
                        ),
                        const Gap(height: 16),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFD97706),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onPressed: _openAddDamageSheet,
                          child: const Text('Add Damage'),
                        ),
                      ],
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: damagesList.length,
                    separatorBuilder: (context, index) => const Gap(height: 12),
                    itemBuilder: (context, index) {
                      final damage = damagesList[index];
                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                color: const Color(0xFFF1F5F9),
                                image: DecorationImage(
                                  image:
                                      damage['photo'].startsWith('http') ||
                                          damage['photo'].startsWith('blob:')
                                      ? NetworkImage(damage['photo'])
                                            as ImageProvider
                                      : FileImage(File(damage['photo'])),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            const Gap(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  AppText(
                                    data: damage['component'] ?? '',
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                  const Gap(height: 2),
                                  AppText(
                                    data: damage['condition'] ?? '',
                                    color: const Color(0xFFEF4444),
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  if (damage['comment'] != null &&
                                      damage['comment'].toString().isNotEmpty)
                                    Padding(
                                      padding: const EdgeInsets.only(top: 4),
                                      child: AppText(
                                        data: damage['comment'],
                                        color: const Color(0xFF64748B),
                                        fontSize: 12,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(
                                Icons.delete,
                                color: Color(0xFF94A3B8),
                              ),
                              onPressed: () {
                                setState(() {
                                  damagesList.removeAt(index);
                                });
                              },
                            ),
                          ],
                        ),
                      );
                    },
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
              if (damageStatus == null) {
                Get.snackbar(
                  'Required',
                  'Please select damage status',
                  backgroundColor: Colors.red.withOpacity(0.9),
                  colorText: Colors.white,
                  snackPosition: SnackPosition.bottom,
                );
                return;
              }
              if (hasDamage && damagesList.isEmpty) {
                Get.snackbar(
                  'Required',
                  'Please add at least one damage',
                  backgroundColor: Colors.red.withOpacity(0.9),
                  colorText: Colors.white,
                  snackPosition: SnackPosition.bottom,
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
                  'status': damageStatus,
                };

                final List<MultipartFile> files = [];
                final List<String> labels = [];

                if (hasDamage) {
                  // Make a copy of damages to send, mapping local photos to refs
                  List<Map<String, dynamic>> payloadDamages = [];
                  for (int i = 0; i < damagesList.length; i++) {
                    final d = damagesList[i];
                    final String photoStr = d['photo'];
                    bool isNetwork =
                        photoStr.startsWith('http') &&
                        !photoStr.startsWith('blob:http');

                    Map<String, dynamic> dmgCopy = {
                      'component': d['component'],
                      'condition': d['condition'],
                      'comment': d['comment'],
                    };

                    if (!isNetwork) {
                      final bytes = await FlutterImageCompress.compressWithFile(
                        photoStr,
                        minWidth: 800,
                        minHeight: 800,
                        quality: 70,
                      );
                      if (bytes != null) {
                        files.add(
                          MultipartFile.fromBytes(
                            bytes,
                            filename: 'damage_$i.jpg',
                          ),
                        );
                        String photoRef = 'damagePhoto_$i';
                        labels.add(photoRef);
                        dmgCopy['photoRef'] = photoRef;
                      }
                    } else {
                      dmgCopy['photo'] = photoStr; // already uploaded
                    }
                    payloadDamages.add(dmgCopy);
                  }

                  uploadData['damagesList'] = jsonEncode(payloadDamages);

                  if (files.isNotEmpty) {
                    uploadData['image'] = files;
                    uploadData['imageLabels'] = labels;
                  }
                }

                Response res;
                if (widget.isDelivery) {
                  res = await repo.updateDeliveryInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'damageReport',
                    uploadData,
                  );
                } else {
                  res = await repo.updatePickupInspection(
                    widget.mission['_id'] ?? widget.reqId,
                    'damageReport',
                    uploadData,
                  );
                }

                if (mounted)
                  Navigator.of(context).pop(); // close loading dialog

                if (res.statusCode == 200) {
                  final inspectionKey = widget.isDelivery
                      ? 'deliveryInspection'
                      : 'pickupInspection';
                  if (widget.mission['details'][inspectionKey] == null) {
                    widget.mission['details'][inspectionKey] =
                        <String, dynamic>{};
                  }
                  final savedData = res
                      .data['data']['details'][inspectionKey]['damageReport'];
                  widget.mission['details'][inspectionKey]['damageReport'] =
                      savedData;

                  if (mounted)
                    Navigator.of(
                      context,
                    ).pop(savedData); // return to previous screen
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
                child: const AppText(
                  data: 'Save',
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

  Widget _buildSectionTitle(String title) {
    return AppText(
      data: title,
      fontSize: 16,
      fontWeight: FontWeight.bold,
      color: const Color(0xFF0F172A),
    );
  }

  Widget _buildRadioOption(
    String label,
    String? groupValue,
    ValueChanged<String?> onChanged, {
    bool isDanger = false,
  }) {
    bool isSelected = label == groupValue;
    return InkWell(
      onTap: () => onChanged(label),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: isSelected && isDanger
            ? BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFEF4444)),
              )
            : null,
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected
                      ? (isDanger
                            ? const Color(0xFFEF4444)
                            : const Color(0xFF2563EB))
                      : const Color(0xFFCBD5E1),
                  width: isSelected ? 6 : 1,
                ),
              ),
            ),
            const Gap(width: 12),
            AppText(
              data: label,
              fontSize: 14,
              color: isSelected && isDanger
                  ? const Color(0xFFB91C1C)
                  : const Color(0xFF334155),
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSheetRadio(
    String label,
    String? groupValue,
    ValueChanged<String?> onChanged,
  ) {
    bool isSelected = label == groupValue;
    return InkWell(
      onTap: () => onChanged(label),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        color: isSelected ? const Color(0xFFEFF6FF) : Colors.transparent,
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected
                      ? const Color(0xFF2563EB)
                      : const Color(0xFFCBD5E1),
                  width: isSelected ? 6 : 1,
                ),
              ),
            ),
            const Gap(width: 12),
            AppText(
              data: label,
              fontSize: 14,
              color: isSelected
                  ? const Color(0xFF1E3A8A)
                  : const Color(0xFF334155),
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ],
        ),
      ),
    );
  }
}
