import 'package:Vehiqqo/const/images/app_asset_images.dart';
import 'package:Vehiqqo/screens/auth/controllers/pending_approval_controller.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PendingApprovalScreen extends StatelessWidget {
  const PendingApprovalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(PendingApprovalController());
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(AppSize.width(value: 24)),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                AssetsImagesPath.logo,
                width: 150,
                errorBuilder: (context, error, stackTrace) {
                  return const SizedBox();
                },
              ),
              const Gap(height: 40),
              Container(
                width: 100,
                height: 100,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFFBEB),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.hourglass_top,
                  size: 48,
                  color: Color(0xFFF59E0B),
                ),
              ),
              const Gap(height: 32),
              const AppText(
                data: 'Waiting for Approval',
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                textAlign: TextAlign.center,
              ),
              const Gap(height: 16),
              Obx(
                () => AppText(
                  data: controller.message.value,
                  fontSize: 15,
                  color: const Color(0xFF64748B),
                  textAlign: TextAlign.center,
                  height: 1.5,
                ),
              ),
              const Gap(height: 40),
              GestureDetector(
                onTap: controller.checkStatus,
                child: Container(
                  width: double.infinity,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Center(
                    child: Obx(
                      () => controller.isLoading.value
                          ? const SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2.5,
                              ),
                            )
                          : const AppText(
                              data: 'Check Status',
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                    ),
                  ),
                ),
              ),
              const Gap(height: 16),
              GestureDetector(
                onTap: controller.logout,
                child: const AppText(
                  data: 'Log Out',
                  color: Color(0xFFEF4444),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
