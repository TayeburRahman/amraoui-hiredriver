import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'controllers/account_controller.dart';

class SkillsOverviewScreen extends StatelessWidget {
  const SkillsOverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final AccountController controller = Get.find<AccountController>();

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddSkillDialog(context, controller),
        backgroundColor: const Color(0xFF2563EB),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: AccountSubPageLayout(
        title: 'Skills Overview',
        subtitle: 'Your qualifications and driving expertise.',
        child: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }
          if (controller.skills.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(32.0),
                child: AppText(
                  data: 'No skills added yet. Tap + to add one.',
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
                final index = entry.key;
                final skill = entry.value;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _skillChip(
                    name: skill['name'] ?? '',
                    stars: (skill['stars'] ?? 0) as int,
                    onDelete: () => controller.deleteSkill(index),
                  ),
                );
              }),
            ],
          );
        }),
      ),
    );
  }

  void _showAddSkillDialog(BuildContext context, AccountController controller) {
    final TextEditingController nameController = TextEditingController();
    int selectedStars = 3;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              backgroundColor: Colors.white,
              title: const AppText(
                data: 'Add Skill',
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: nameController,
                    decoration: const InputDecoration(
                      labelText: 'Skill Name (e.g. Long Distance)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const Gap(height: 16),
                  const AppText(
                    data: 'Rating (1-5 stars)',
                    fontSize: 14,
                    color: Color(0xFF64748B),
                  ),
                  const Gap(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      return IconButton(
                        icon: Icon(
                          index < selectedStars ? Icons.star : Icons.star_border,
                          color: const Color(0xFFFBBF24),
                          size: 32,
                        ),
                        onPressed: () {
                          setState(() {
                            selectedStars = index + 1;
                          });
                        },
                      );
                    }),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const AppText(
                    data: 'Cancel',
                    fontSize: 16,
                    color: Color(0xFF64748B),
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                  ),
                  onPressed: () {
                    final name = nameController.text.trim();
                    if (name.isNotEmpty) {
                      controller.addSkill(name, selectedStars);
                      Navigator.pop(context);
                    }
                  },
                  child: const AppText(
                    data: 'Add',
                    fontSize: 16,
                    color: Colors.white,
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _skillChip({
    required String name,
    required int stars,
    required VoidCallback onDelete,
  }) {
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
          const Gap(width: 8),
          GestureDetector(
            onTap: onDelete,
            child: const Icon(
              Icons.delete_outline,
              color: Color(0xFFEF4444),
            ),
          ),
        ],
      ),
    );
  }
}
