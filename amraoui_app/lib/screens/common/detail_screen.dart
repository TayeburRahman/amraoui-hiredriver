import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class DetailScreen extends StatelessWidget {
  const DetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final args = Get.arguments as Map<String, dynamic>? ?? {};
    final title = args['title'] as String? ?? 'Details';
    final subtitle = args['subtitle'] as String? ?? '';
    final fields = args['fields'] as Map<String, String>? ?? {};

    return AccountSubPageLayout(
      title: title,
      subtitle: subtitle.isNotEmpty ? subtitle : null,
      child: Column(
        children: fields.entries.map((entry) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Container(
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
                  AppText(data: entry.key, fontSize: 13, color: const Color(0xFF64748B)),
                  const Gap(height: 4),
                  AppText(
                    data: entry.value,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF0F172A),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
