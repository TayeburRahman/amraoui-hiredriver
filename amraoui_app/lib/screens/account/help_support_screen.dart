import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/layout/account_sub_page_layout.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AccountSubPageLayout(
      title: 'Help / Support',
      subtitle: 'Contact our support team for assistance.',
      child: Column(
        children: [
          _supportTile(
            Icons.email_outlined,
            'Email Support',
            'driver@Vehiqqo .com',
          ),
          const Gap(height: 12),
          _supportTile(
            Icons.phone_outlined,
            'Phone Support',
            '+33 1 23 45 67 89',
          ),
          const Gap(height: 12),
          _supportTile(
            Icons.chat_outlined,
            'Live Chat',
            'Available 9 AM – 6 PM',
          ),
          const Gap(height: 24),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const AppText(
              data:
                  'For urgent mission issues, please call the support line directly.',
              fontSize: 14,
              color: Color(0xFF2563EB),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _supportTile(IconData icon, String title, String subtitle) {
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
                  data: subtitle,
                  fontSize: 13,
                  color: const Color(0xFF64748B),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
