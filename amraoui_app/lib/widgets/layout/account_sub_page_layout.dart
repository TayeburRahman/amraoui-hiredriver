import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AccountSubPageLayout extends StatelessWidget {
  const AccountSubPageLayout({
    super.key,
    required this.title,
    required this.child,
    this.subtitle,
  });

  final String title;
  final String? subtitle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFC),
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Color(0xFF0F172A),
            size: 20,
          ),
          onPressed: () => Get.back(),
        ),
        title: AppText(
          data: title,
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: const Color(0xFF0F172A),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (subtitle != null) ...[
                const Gap(height: 8),
                AppText(
                  data: subtitle!,
                  fontSize: 14,
                  color: const Color(0xFF64748B),
                ),
              ],
              const Gap(height: 24),
              child,
              const Gap(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
