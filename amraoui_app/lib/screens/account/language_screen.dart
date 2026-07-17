import 'package:Vehiqqo/widgets/layout/account_sub_page_layout.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LanguageScreen extends StatelessWidget {
  const LanguageScreen({super.key});

  static const _languages = [
    ('English', 'en', 'US'),
    ('French', 'fr', 'FR'),
    ('Dutch', 'nl', 'NL'),
  ];

  @override
  Widget build(BuildContext context) {
    final currentLocale = Get.locale?.languageCode ?? 'en';

    return AccountSubPageLayout(
      title: 'Language',
      subtitle: 'Choose your preferred app language.',
      child: Column(
        children: _languages.map((lang) {
          final isSelected = currentLocale == lang.$2;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: GestureDetector(
              onTap: () {
                Get.updateLocale(Locale(lang.$2, lang.$3));
                Get.back();
              },
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFF2563EB)
                        : const Color(0xFFE2E8F0),
                    width: isSelected ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: AppText(
                        data: lang.$1,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                    if (isSelected)
                      const Icon(Icons.check_circle, color: Color(0xFF2563EB)),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
