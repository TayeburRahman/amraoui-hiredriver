import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'controllers/documents_controller.dart';

class DocumentsScreen extends StatelessWidget {
  const DocumentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final DocumentsController controller = Get.put(DocumentsController());

    return AccountSubPageLayout(
      title: 'Documents',
      subtitle: 'View, update, or remove your uploaded files.',
      child: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        return Stack(
          children: [
            Column(
              children: [
                _documentTile(
                  controller: controller,
                  docType: 'license_document',
                  title: 'Driving License',
                  docUrl: controller.licenseDoc.value,
                  icon: Icons.badge_outlined,
                ),
                const Gap(height: 12),
                _documentTile(
                  controller: controller,
                  docType: 'id_document',
                  title: 'ID Document',
                  docUrl: controller.idDoc.value,
                  icon: Icons.credit_card_outlined,
                ),
                const Gap(height: 12),
                _documentTile(
                  controller: controller,
                  docType: 'contract_document',
                  title: 'Signed Contract',
                  docUrl: controller.contractDoc.value,
                  icon: Icons.description_outlined,
                ),
              ],
            ),
            if (controller.isUploading.value)
              Positioned.fill(
                child: Container(
                  color: Colors.black26,
                  child: const Center(child: CircularProgressIndicator()),
                ),
              ),
          ],
        );
      }),
    );
  }

  Widget _documentTile({
    required DocumentsController controller,
    required String docType,
    required String title,
    required String docUrl,
    required IconData icon,
  }) {
    final hasDoc = docUrl.isNotEmpty;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: const Color(0xFF475569)),
          ),
          const Gap(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppText(
                  data: title,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
                const Gap(height: 2),
                AppText(
                  data: hasDoc ? 'Uploaded' : 'Missing',
                  fontSize: 13,
                  color: hasDoc ? const Color(0xFF16A34A) : const Color(0xFFEF4444),
                ),
              ],
            ),
          ),
          if (hasDoc) ...[
            IconButton(
              icon: const Icon(Icons.edit, color: Color(0xFF2563EB)),
              onPressed: () => controller.pickAndUploadDocument(docType),
              tooltip: 'Update Document',
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline, color: Color(0xFFEF4444)),
              onPressed: () => _confirmDelete(Get.context!, controller, docType, title),
              tooltip: 'Delete Document',
            ),
          ] else ...[
            ElevatedButton.icon(
              onPressed: () => controller.pickAndUploadDocument(docType),
              icon: const Icon(Icons.upload_file, size: 16, color: Colors.white),
              label: const AppText(data: 'Upload', fontSize: 13, color: Colors.white),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, DocumentsController controller, String docType, String title) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: AppText(data: 'Delete $title?', fontSize: 18, fontWeight: FontWeight.bold),
        content: const AppText(data: 'Are you sure you want to remove this document?', fontSize: 14),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const AppText(data: 'Cancel', fontSize: 16, color: Color(0xFF64748B)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444)),
            onPressed: () {
              Navigator.pop(context);
              controller.deleteDocument(docType);
            },
            child: const AppText(data: 'Delete', fontSize: 16, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
