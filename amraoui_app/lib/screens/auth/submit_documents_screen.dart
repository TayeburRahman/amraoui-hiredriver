import 'package:amraoui_app/screens/auth/controllers/submit_documents_controller.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

class SubmitDocumentsScreen extends StatelessWidget {
  const SubmitDocumentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SubmitDocumentsController());
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFC),
        elevation: 0,
        title: const AppText(
          data: 'Submit Documents',
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Color(0xFF0F172A),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: EdgeInsets.all(AppSize.width(value: 24)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const AppText(
              data: 'Upload your driver documents for admin verification.',
              fontSize: 14,
              color: Color(0xFF64748B),
            ),
            const Gap(height: 24),
            _docPicker(
              title: 'Driver License *',
              subtitle: 'Required',
              onTap: controller.pickLicense,
              file: controller.licenseFile,
            ),
            const Gap(height: 16),
            _docPicker(
              title: 'ID Document *',
              subtitle: 'Required',
              onTap: controller.pickId,
              file: controller.idFile,
            ),
            const Gap(height: 16),
            _docPicker(
              title: 'Contract Document',
              subtitle: 'Optional',
              onTap: controller.pickContract,
              file: controller.contractFile,
            ),
            const Spacer(),
            GestureDetector(
              onTap: controller.submit,
              child: Container(
                width: double.infinity,
                height: 56,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(
                  child: AppText(
                    data: 'Submit Documents',
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            const Gap(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _docPicker({
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    required Rxn<XFile> file,
  }) {
    return Obx(() {
      final selected = file.value != null;
      return GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: selected ? const Color(0xFF2563EB) : const Color(0xFFE2E8F0),
            ),
          ),
          child: Row(
            children: [
              Icon(
                selected ? Icons.check_circle : Icons.upload_file,
                color: selected ? const Color(0xFF16A34A) : const Color(0xFF64748B),
              ),
              const Gap(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppText(data: title, fontWeight: FontWeight.w700, fontSize: 15),
                    AppText(
                      data: selected ? file.value!.name : subtitle,
                      fontSize: 13,
                      color: const Color(0xFF64748B),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    });
  }
}
