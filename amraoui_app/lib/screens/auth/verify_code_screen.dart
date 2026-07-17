import 'package:amraoui_app/screens/auth/controllers/verify_code_controller.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/inputs/otp_input_field_widget.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class VerifyCodeScreen extends StatelessWidget {
  const VerifyCodeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(VerifyCodeController());
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Get.back(),
        ),
      ),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
        child: Column(
          children: [
            SizedBox(height: AppSize.height(value: 40)),
            // Shield Icon
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: const Color(0xFFF0F7FF),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.verified_user_outlined,
                size: 48,
                color: Color(0xFF2563EB),
              ),
            ),

            const Gap(height: 40),

            const AppText(
              data: 'Verify Code',
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
            const Gap(height: 16),
            const AppText(
              data: 'We sent a 6-digit code to your email address.',
              textAlign: TextAlign.center,
              fontSize: 15,
              color: Color(0xFF64748B),
              height: 1.5,
            ),

            const Gap(height: 40),

            // OTP Fields
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(
                6,
                (index) => OtpInputFieldWidget(
                  controller: controller.otpControllers[index],
                  isLast: index == 5,
                  borderColor: const Color(0xFFE2E8F0),
                  fillColor: Colors.white,
                ),
              ),
            ),

            const Gap(height: 24),

            Obx(() => AppText(
              data: 'Code expires in ${controller.formattedTime}',
              color: const Color(0xFF64748B),
              fontSize: 14,
            )),

            const Gap(height: 16),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const AppText(
                  data: "Didn't receive the code? ",
                  color: Color(0xFF64748B),
                  fontSize: 18,
                ),
                Obx(() => GestureDetector(
                  onTap: controller.remainingSeconds.value == 0
                      ? controller.resendCode
                      : null,
                  child: AppText(
                    data: 'Resend',
                    color: controller.remainingSeconds.value == 0
                        ? const Color(0xFF2563EB)
                        : const Color(0xFF94A3B8),
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                )),
              ],
            ),

            const Spacer(),

            // Verify Button
            Obx(() => GestureDetector(
              onTap: controller.isLoading.value ? null : controller.verify,
              child: Container(
                width: double.infinity,
                height: 56,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: controller.isLoading.value
                      ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const AppText(
                          data: 'Verify Code',
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                ),
              ),
            )),

            const Gap(height: 40),
          ],
        ),
      ),
    );
  }
}
