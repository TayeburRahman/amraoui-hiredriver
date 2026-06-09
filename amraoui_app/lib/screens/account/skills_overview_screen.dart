import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

class SkillsOverviewScreen extends StatelessWidget {
  const SkillsOverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AccountSubPageLayout(
      title: 'Skills Overview',
      subtitle: 'Your qualifications and driving expertise.',
      child: Column(
        children: [
          _skillChip('Long Distance', 5),
          const Gap(height: 12),
          _skillChip('Luxury Vehicles', 4),
          const Gap(height: 12),
          _skillChip('City Navigation', 5),
          const Gap(height: 12),
          _skillChip('Customer Service', 4),
        ],
      ),
    );
  }

  Widget _skillChip(String name, int stars) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Expanded(
            child: AppText(
              data: name,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF0F172A),
            ),
          ),
          Row(
            children: List.generate(
              5,
              (i) => Icon(
                i < stars ? Icons.star : Icons.star_border,
                color: const Color(0xFFFBBF24),
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
