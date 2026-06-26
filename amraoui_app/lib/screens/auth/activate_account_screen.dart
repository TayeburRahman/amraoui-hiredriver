import 'package:amraoui_app/screens/auth/controllers/activate_account_controller.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/inputs/otp_input_field_widget.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ActivateAccountScreen extends StatelessWidget {
  const ActivateAccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ActivateAccountController());
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
      // 1. Ensure the body resizes nicely when keyboard appears
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          // 2. Wrap with SingleChildScrollView
          physics: const ClampingScrollPhysics(), // Prevents awkward bouncing
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
            child: Column(
              children: [
                const Gap(height: 40),
                Container(
                  width: 100,
                  height: 100,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF0F7FF),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.mark_email_read_outlined,
                    size: 48,
                    color: Color(0xFF2563EB),
                  ),
                ),
                const Gap(height: 40),
                const AppText(
                  data: 'Verify Your Email',
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
                const Gap(height: 16),
                AppText(
                  data: 'Enter the 6-digit code sent to ${controller.email}',
                  textAlign: TextAlign.center,
                  fontSize: 15,
                  color: const Color(0xFF64748B),
                  height: 1.5,
                ),
                const Gap(height: 40),
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const AppText(
                      data: "Didn't receive the code? ",
                      color: Color(0xFF64748B),
                      fontSize: 14,
                    ),
                    GestureDetector(
                      onTap: controller.resendCode,
                      child: const AppText(
                        data: 'Resend',
                        color: Color(0xFF2563EB),
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                // 3. Replaced Spacer() with a flexible Gap to avoid unbound height errors
                const Gap(height: 60),
                GestureDetector(
                  onTap: controller.verify,
                  child: Container(
                    width: double.infinity,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Center(
                      child: AppText(
                        data: 'Verify Email',
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const Gap(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
