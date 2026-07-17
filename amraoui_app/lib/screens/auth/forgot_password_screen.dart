import 'package:Vehiqqo/screens/auth/controllers/forgot_password_controller.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/inputs/app_input_widget.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ForgotPasswordScreen extends StatelessWidget {
  const ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ForgotPasswordController());
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
            const Gap(height: 40),
            // Top Lock Icon
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(
                Icons.lock_outline,
                size: 48,
                color: Color(0xFF2563EB),
              ),
            ),

            const Gap(height: 40),

            const AppText(
              data: 'Forgot password?',
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
            const Gap(height: 16),
            const AppText(
              data:
                  'Enter your email or mobile number to receive reset instructions.',
              textAlign: TextAlign.center,
              fontSize: 15,
              color: Color(0xFF64748B),
              height: 1.5,
            ),

            const Gap(height: 40),

            // Email/Phone Field
            const Align(
              alignment: Alignment.centerLeft,
              child: AppText(
                data: 'Email or mobile number',
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Color(0xFF334155),
              ),
            ),
            const Gap(height: 8),
            AppInputWidget(
              controller: controller.contactController,
              hintText: 'your.email@example.com',
              prefix: const Icon(
                Icons.mail_outline,
                color: Color(0xFF64748B),
                size: 20,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
            ),

            const Spacer(),

            // Send Code Button
            Obx(
              () => GestureDetector(
                onTap: controller.isLoading.value ? null : controller.sendCode,
                child: Container(
                  width: double.infinity,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                      colors: [Color(0xFF3B82F6), Color(0xFF06B6D4)],
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
                            data: 'Send Code',
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                  ),
                ),
              ),
            ),

            const Gap(height: 16),

            // Back to Login
            GestureDetector(
              onTap: controller.backToLogin,
              child: Container(
                height: 40,
                alignment: Alignment.center,
                child: const AppText(
                  data: 'Back to Login',
                  color: Color(0xFF2563EB),
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),

            const Gap(height: 30),
          ],
        ),
      ),
    );
  }
}
