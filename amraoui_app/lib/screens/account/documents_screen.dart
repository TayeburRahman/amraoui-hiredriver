import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

class DocumentsScreen extends StatelessWidget {
  const DocumentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AccountSubPageLayout(
      title: 'Documents',
      subtitle: 'View your driver papers and uploaded files.',
      child: Column(
        children: [
          _documentTile('Driver License', 'Verified', Icons.badge_outlined),
          const Gap(height: 12),
          _documentTile('ID Document', 'Verified', Icons.credit_card_outlined),
          const Gap(height: 12),
          _documentTile('Signed Contract', 'Pending review', Icons.description_outlined),
          const Gap(height: 12),
          _documentTile('Insurance Certificate', 'Verified', Icons.shield_outlined),
        ],
      ),
    );
  }

  Widget _documentTile(String title, String status, IconData icon) {
    final isVerified = status == 'Verified';

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
                AppText(data: status, fontSize: 13, color: const Color(0xFF64748B)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isVerified ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
              borderRadius: BorderRadius.circular(12),
            ),
            child: AppText(
              data: isVerified ? 'OK' : 'Pending',
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: isVerified ? const Color(0xFF16A34A) : const Color(0xFFF59E0B),
            ),
          ),
        ],
      ),
    );
  }
}
