import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AccountSubPageLayout(
      title: 'Profile',
      subtitle: 'View and manage your personal details.',
      child: Column(
        children: [
          _infoCard('Full Name', 'Jean Dupont'),
          const Gap(height: 12),
          _infoCard('Email', 'jean.dupont@example.com'),
          const Gap(height: 12),
          _infoCard('Phone', '+33 6 12 34 56 78'),
          const Gap(height: 12),
          _infoCard('Address', 'Paris, France'),
          const Gap(height: 12),
          _infoCard('Date of Birth', '15 Jan 1990'),
          const Gap(height: 12),
          _infoCard('Driver Status', 'Verified Driver'),
        ],
      ),
    );
  }

  Widget _infoCard(String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppText(data: label, fontSize: 13, color: const Color(0xFF64748B)),
          const Gap(height: 4),
          AppText(
            data: value,
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF0F172A),
          ),
        ],
      ),
    );
  }
}
