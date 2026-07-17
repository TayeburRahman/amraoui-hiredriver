import 'package:Vehiqqo/screens/auth/controllers/create_new_password_controller.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/inputs/app_input_widget.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CreateNewPasswordScreen extends StatelessWidget {
  const CreateNewPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(CreateNewPasswordController());
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        surfaceTintColor: Colors.transparent,
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Get.back(),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
        child: Column(
          children: [
            const Gap(height: 40),
            // Lock Icon
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: const Color(0xFFF0F7FF),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.lock_outline,
                size: 48,
                color: Color(0xFF2563EB),
              ),
            ),

            const Gap(height: 40),

            const AppText(
              data: 'Create New Password',
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
            const Gap(height: 16),
            const AppText(
              data:
                  'Your new password must be different from your previous password.',
              textAlign: TextAlign.center,
              fontSize: 15,
              color: Color(0xFF64748B),
              height: 1.5,
            ),

            const Gap(height: 40),

            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFFF1F5F9)),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildFieldLabel('New Password'),
                  AppInputWidget(
                    controller: controller.newPasswordController,
                    hintText: 'Enter new password',
                    prefix: const Icon(
                      Icons.lock_outline,
                      color: Color(0xFF2563EB),
                      size: 20,
                    ),
                    isPassWord: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                    ),
                  ),

                  const Gap(height: 20),

                  _buildFieldLabel('Confirm Password'),
                  AppInputWidget(
                    controller: controller.confirmPasswordController,
                    hintText: 'Re-enter new password',
                    prefix: const Icon(
                      Icons.lock_outline,
                      color: Color(0xFF2563EB),
                      size: 20,
                    ),
                    isPassWord: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                    ),
                  ),

                  const Gap(height: 24),

                  _buildRequirementItem('At least 8 characters', true),
                  _buildRequirementItem('One uppercase letter', false),
                  _buildRequirementItem('One number', false),
                  _buildRequirementItem('One special character', false),
                ],
              ),
            ),

            const Gap(height: 40),

            // Reset Password Button
            GestureDetector(
              onTap: controller.resetPassword,
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
                child: const AppText(
                  data: 'Reset Password',
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),

            const Gap(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: AppText(
        data: label,
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: const Color(0xFF64748B),
      ),
    );
  }

  Widget _buildRequirementItem(String text, bool isMet) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        children: [
          Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: isMet
                    ? const Color(0xFF2563EB)
                    : const Color(0xFFCBD5E1),
              ),
              color: isMet ? const Color(0xFF2563EB) : Colors.transparent,
            ),
            child: isMet
                ? const Icon(Icons.check, size: 12, color: Colors.white)
                : null,
          ),
          const Gap(width: 12),
          AppText(
            data: text,
            fontSize: 13,
            color: isMet ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
            fontWeight: isMet ? FontWeight.w500 : FontWeight.normal,
          ),
        ],
      ),
    );
  }
}
