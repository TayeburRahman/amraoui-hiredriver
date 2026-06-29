import 'package:amraoui_app/const/images/app_asset_images.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:amraoui_app/screens/onboard_screen/controllers/onboard_controller.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class OnboardScreen extends StatelessWidget {
  const OnboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(OnboardController());
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFF4F9FF), Color(0xFFE6F0FE)],
          ),
        ),
        child: Column(
          children: [
            // The sliding content
            Expanded(
              child: PageView(
                controller: controller.pageController,
                onPageChanged: controller.onPageChanged,
                children: [
                  _buildPage(
                    imagePath: AssetsImagesPath.onBoard1,
                    title: 'Request vehicle\ntransport',
                    description:
                        'Create a delivery request with pickup, delivery, and vehicle details in a few simple steps.',
                  ),
                  _buildPage(
                    imagePath: AssetsImagesPath.onBoard2,
                    title: 'Track every step',
                    description:
                        'Follow your vehicle from pickup to in-transit and final delivery with clear live status updates.',
                  ),
                  _buildPage(
                    imagePath: AssetsImagesPath.onBoard3,
                    title: 'Get full delivery proof',
                    description:
                        'View inspection photos, damage reports, mileage, fuel proof, and final signatures after delivery.',
                  ),
                ],
              ),
            ),
            // The static buttons at the bottom
            Container(
              color: Colors.white,
              width: double.infinity,
              child: SafeArea(
                top: false,
                child: Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: AppSize.width(value: 24),
                    vertical: AppSize.height(value: 10),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Indicators
                      Obx(() => Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(
                              3,
                              (index) => AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                margin: const EdgeInsets.symmetric(horizontal: 4),
                                height: 6,
                                width: controller.currentPage.value == index ? 24 : 6,
                                decoration: BoxDecoration(
                                  color: controller.currentPage.value == index
                                      ? const Color(0xFF2563EB)
                                      : const Color(0xFFE2E8F0),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                              ),
                            ),
                          )),
                      SizedBox(height: AppSize.height(value: 32)),
                      // Next / Get Started button
                      Obx(() => GestureDetector(
                            onTap: controller.next,
                            child: Container(
                              width: double.infinity,
                              height: 56, // Tall, sleek button
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                  colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                                ),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Center(
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      controller.currentPage.value == 2
                                          ? 'Get Started'
                                          : 'Next',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    if (controller.currentPage.value != 2) ...[
                                      const SizedBox(width: 8),
                                      const Icon(
                                        Icons.arrow_forward,
                                        color: Colors.white,
                                        size: 20,
                                      ),
                                    ]
                                  ],
                                ),
                              ),
                            ),
                          )),
                      SizedBox(height: AppSize.height(value: 16)),
                      // Skip Button
                      GestureDetector(
                        onTap: controller.skip,
                        child: Container(
                          height: 40,
                          alignment: Alignment.center,
                          child: const Text(
                            'Skip',
                            style: TextStyle(
                              color: Color(0xFF2563EB),
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: AppSize.height(value: 10)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPage({
    required String imagePath,
    required String title,
    required String description,
  }) {
    return Column(
      children: [
        Expanded(
          flex: 55,
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: EdgeInsets.only(
                top: AppSize.height(value: 40),
                left: AppSize.width(value: 20),
                right: AppSize.width(value: 20),
                bottom: AppSize.height(value: 20),
              ),
              child: Center(
                child: Image.asset(
                  imagePath,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) {
                    return const Icon(Icons.image_not_supported,
                        size: 100, color: Colors.grey);
                  },
                ),
              ),
            ),
          ),
        ),
        Expanded(
          flex: 45,
          child: Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(32),
                topRight: Radius.circular(32),
              ),
            ),
            padding: EdgeInsets.only(
              left: AppSize.width(value: 24),
              right: AppSize.width(value: 24),
              top: AppSize.height(value: 32),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                    height: 1.1,
                    letterSpacing: -0.5,
                  ),
                ),
                SizedBox(height: AppSize.height(value: 8)),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 15,
                    color: Color(0xFF64748B),
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
