import 'package:amraoui_app/const/images/app_asset_images.dart';
import 'package:amraoui_app/screens/auth/controllers/sign_up_controller.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/inputs/app_input_widget.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:country_picker/country_picker.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SignUpController());
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        surfaceTintColor: Colors.transparent,
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Get.back(),
        ),
      ),
      body: Container(
        height: double.infinity,
        width: double.infinity,
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage(AssetsImagesPath.signUpImage),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Gap(height: 40),
                const AppText(
                  data: 'Create your account',
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                  letterSpacing: -1,
                ),
                const Gap(height: 8),
                const AppText(
                  data: 'Start requesting vehicle deliveries',
                  fontSize: 16,
                  color: Color(0xFF64748B),
                ),
                const Gap(height: 40),

                // Full Name
                _buildFieldLabel('Full name'),
                AppInputWidget(
                  controller: controller.nameController,
                  hintText: 'John Doe',
                  prefix: const Icon(
                    Icons.person_outline,
                    color: Color(0xFF64748B),
                    size: 20,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),

                const Gap(height: 20),

                // Email
                _buildFieldLabel('Email'),
                AppInputWidget(
                  controller: controller.emailController,
                  hintText: 'your.email@example.com',
                  isEmail: true,
                  prefix: const Icon(
                    Icons.mail_outline,
                    color: Color(0xFF64748B),
                    size: 20,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),

                const Gap(height: 20),

                // Phone Number
                _buildFieldLabel('Phone number'),
                Obx(
                  () => AppInputWidget(
                    controller: controller.phoneController,
                    keyboardType: TextInputType.phone,
                    hintText: '+1 (555) 000-0000',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Colors.white),
                    ),
                    prefixIconConstraints: BoxConstraints(
                      maxWidth: AppSize.width(value: 120),
                      maxHeight: AppSize.width(value: 40),
                    ),
                    prefix: InkWell(
                      onTap: () {
                        showCountryPicker(
                          context: context,
                          showPhoneCode: true,
                          onSelect: (Country country) {
                            controller.updateCountry(country);
                          },
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            AppText(
                              data: controller.selectedCountry.value.flagEmoji,
                              fontSize: 20,
                            ),
                            const Gap(width: 8),
                            AppText(
                              data:
                                  '+${controller.selectedCountry.value.phoneCode}',
                              color: const Color(0xFF0F172A),
                              fontWeight: FontWeight.w600,
                            ),
                            const Icon(
                              Icons.keyboard_arrow_down,
                              size: 16,
                              color: Color(0xFF64748B),
                            ),
                            const Gap(width: 8),
                            Container(
                              height: 24,
                              width: 1,
                              color: const Color(0xFFE2E8F0),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                const Gap(height: 20),

                _buildFieldLabel('License number'),
                AppInputWidget(
                  controller: controller.licenseController,
                  hintText: 'AB-123456',
                  prefix: const Icon(Icons.badge_outlined, color: Color(0xFF64748B), size: 20),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),
                const Gap(height: 20),
                _buildFieldLabel('Vehicle type'),
                AppInputWidget(
                  controller: controller.vehicleTypeController,
                  hintText: 'Sedan, SUV, Van...',
                  prefix: const Icon(Icons.directions_car_outlined, color: Color(0xFF64748B), size: 20),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),
                const Gap(height: 20),
                _buildFieldLabel('Vehicle plate'),
                AppInputWidget(
                  controller: controller.vehiclePlateController,
                  hintText: 'AB-123-CD',
                  prefix: const Icon(Icons.pin_outlined, color: Color(0xFF64748B), size: 20),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),

                const Gap(height: 20),

                // Password
                _buildFieldLabel('Password'),
                AppInputWidget(
                  controller: controller.passwordController,
                  hintText: 'Create a password',
                  isPassWord: true,
                  prefix: const Icon(
                    Icons.lock_outline,
                    color: Color(0xFF64748B),
                    size: 20,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),

                const Gap(height: 20),

                // Confirm Password
                _buildFieldLabel('Confirm password'),
                AppInputWidget(
                  controller: controller.confirmPasswordController,
                  hintText: 'Re-enter your password',
                  isPassWord: true,
                  prefix: const Icon(
                    Icons.lock_outline,
                    color: Color(0xFF64748B),
                    size: 20,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),

                const Gap(height: 30),

                // Terms & Conditions
                Row(
                  children: [
                    Obx(
                      () => SizedBox(
                        width: 24,
                        height: 24,
                        child: Checkbox(
                          value: controller.agreeToTerms.value,
                          onChanged: controller.toggleTermsAgreement,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4),
                          ),
                          side: const BorderSide(color: Color(0xFF94A3B8)),
                          activeColor: const Color(0xFF2563EB),
                        ),
                      ),
                    ),
                    const Gap(width: 8),
                    Expanded(
                      child: Text.rich(
                        TextSpan(
                          text: 'I agree to the '.tr,
                          style: const TextStyle(
                            color: Color(0xFF64748B),
                            fontSize: 14,
                          ),
                          children: [
                            TextSpan(
                              text: 'Terms & Conditions'.tr,
                              style: const TextStyle(
                                color: Color(0xFF2563EB),
                                fontWeight: FontWeight.w600,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const Gap(height: 40),

                // Create Account Button
                GestureDetector(
                  onTap: controller.createAccount,
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
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF2563EB).withOpacity(0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: AppText(
                        data: 'Create Account',
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),

                const Gap(height: 32),

                // Login Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const AppText(
                      data: "Already have an account? ",
                      color: Color(0xFF64748B),
                      fontSize: 14,
                    ),
                    GestureDetector(
                      onTap: controller.navigateToLogin,
                      child: const AppText(
                        data: 'Log In',
                        color: Color(0xFF2563EB),
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),

                const Gap(height: 40),
              ],
            ),
          ),
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
        fontWeight: FontWeight.w600,
        color: const Color(0xFF334155),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData prefixIcon,
    bool isPassword = false,
    bool obscureText = false,
    VoidCallback? onToggleVisibility,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
        prefixIcon: Icon(prefixIcon, color: const Color(0xFF64748B), size: 20),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(
                  obscureText
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: const Color(0xFF94A3B8),
                  size: 20,
                ),
                onPressed: onToggleVisibility,
              )
            : null,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.white),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.white),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2563EB), width: 1.5),
        ),
      ),
    );
  }
}
