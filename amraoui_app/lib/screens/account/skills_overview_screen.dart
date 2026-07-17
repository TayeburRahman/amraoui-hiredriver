import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/layout/account_sub_page_layout.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'controllers/account_controller.dart';

class SkillsOverviewScreen extends StatelessWidget {
  const SkillsOverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final AccountController controller = Get.find<AccountController>();

    return Scaffold(
      body: AccountSubPageLayout(
        title: 'Skills Overview',
        subtitle:
            'This function can only be managed and modified by the admin, driver can only see.',
        child: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }
          if (controller.skills.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(32.0),
                child: AppText(
                  data:
                      'No skills added yet. Admin can assign skills to your profile.',
                  fontSize: 16,
                  color: Color(0xFF64748B),
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }
          return Column(
            children: [
              if (controller.isSavingSkills.value)
                const Padding(
                  padding: EdgeInsets.only(bottom: 16),
                  child: LinearProgressIndicator(),
                ),
              ...controller.skills.asMap().entries.map((entry) {
                final skill = entry.value;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _skillChip(
                    name: skill['name'] ?? '',
                    stars: (skill['stars'] ?? 0) as int,
                  ),
                );
              }),
            ],
          );
        }),
      ),
    );
  }

  Widget _skillChip({required String name, required int stars}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
