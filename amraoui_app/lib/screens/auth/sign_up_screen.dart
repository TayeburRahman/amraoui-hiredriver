import 'dart:io';
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
                const Gap(height: 32),

                // Profile Picture Uploader
                Center(
                  child: GestureDetector(
                    onTap: controller.pickProfileImage,
                    child: Obx(() {
                      final imagePath = controller.profileImagePath.value;
                      return Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFFBFDBFE), width: 2),
                          image: imagePath.isNotEmpty 
                              ? DecorationImage(
                                  image: FileImage(File(imagePath)),
                                  fit: BoxFit.cover,
                                )
                              : null,
                        ),
                        child: imagePath.isEmpty 
                            ? const Center(
                                child: Icon(
                                  Icons.add_a_photo_outlined, 
                                  color: Color(0xFF3B82F6), 
                                  size: 32,
                                ),
                              )
                            : null,
                      );
                    }),
                  ),
                ),

                const Gap(height: 32),

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

                _buildFieldLabel('Driver license number'),
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
                
                _buildFieldLabel('Vehicle carrier?'),
                Obx(
                  () => _YesNoToggle(
                    value: controller.isVehicleCarrier.value,
                    onChanged: (val) => controller.isVehicleCarrier.value = val,
                  ),
                ),
                Obx(() => controller.isVehicleCarrier.value ? Column(
                  children: [
                    const Gap(height: 12),
                    _ImageUploadPlaceholder(
                      hint: 'Add a picture of the vehicle carrier',
                      hasImage: controller.vehicleCarrierImagePath.value.isNotEmpty,
                      onTap: controller.pickVehicleCarrierImage,
                    ),
                  ],
                ) : const SizedBox()),

                const Gap(height: 20),
                
                _buildFieldLabel('Dealer plate?'),
                Obx(
                  () => _YesNoToggle(
                    value: controller.isDealerPlate.value,
                    onChanged: (val) => controller.isDealerPlate.value = val,
                  ),
                ),
                Obx(() => controller.isDealerPlate.value ? Column(
                  children: [
                    const Gap(height: 12),
                    _ImageUploadPlaceholder(
                      hint: 'Add a picture of the registration document',
                      hasImage: controller.dealerPlateImagePath.value.isNotEmpty,
                      onTap: controller.pickDealerPlateImage,
                    ),
                  ],
                ) : const SizedBox()),

                const Gap(height: 20),

                _buildFieldLabel('Company name'),
                AppInputWidget(
                  controller: controller.companyNameController,
                  hintText: 'Enter company name',
                  prefix: const Icon(Icons.business_outlined, color: Color(0xFF64748B), size: 20),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.white),
                  ),
                ),
                
                const Gap(height: 20),

                _buildFieldLabel('Tax number company'),
                AppInputWidget(
                  controller: controller.taxNumberController,
                  hintText: 'Enter tax number',
                  prefix: const Icon(Icons.receipt_long_outlined, color: Color(0xFF64748B), size: 20),
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
                GestureDetector(
                  onTap: controller.navigateToLogin,
                  behavior: HitTestBehavior.opaque,
                  child: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        AppText(
                          data: "Already have an account? ",
                          color: Color(0xFF64748B),
                          fontSize: 16,
                        ),
                        AppText(
                          data: 'Log In',
                          color: Color(0xFF2563EB),
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ],
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

class _YesNoToggle extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;

  const _YesNoToggle({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9), // Very light gray-blue background
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => onChanged(true),
              behavior: HitTestBehavior.opaque,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: value ? Colors.white : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: value
                      ? [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          )
                        ]
                      : [],
                ),
                child: Center(
                  child: AppText(
                    data: 'Yes',
                    color: value ? const Color(0xFF0F172A) : const Color(0xFF64748B),
                    fontWeight: value ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => onChanged(false),
              behavior: HitTestBehavior.opaque,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: !value ? Colors.white : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: !value
                      ? [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          )
                        ]
                      : [],
                ),
                child: Center(
                  child: AppText(
                    data: 'No',
                    color: !value ? const Color(0xFF0F172A) : const Color(0xFF64748B),
                    fontWeight: !value ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ImageUploadPlaceholder extends StatelessWidget {
  final String hint;
  final bool hasImage;
  final VoidCallback onTap;

  const _ImageUploadPlaceholder({
    required this.hint,
    this.hasImage = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        decoration: BoxDecoration(
          color: hasImage ? const Color(0xFFDCFCE7) : const Color(0xFFEFF6FF),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: hasImage ? const Color(0xFF86EFAC) : const Color(0xFFBFDBFE),
            width: 1.5,
            style: BorderStyle.solid,
          ),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Icon(
                hasImage ? Icons.check_circle_outline : Icons.add_a_photo_outlined,
                color: hasImage ? const Color(0xFF22C55E) : const Color(0xFF3B82F6),
                size: 24,
              ),
            ),
            const Gap(height: 12),
            AppText(
              data: hasImage ? 'Image Selected' : hint,
              color: hasImage ? const Color(0xFF14532D) : const Color(0xFF1E3A8A),
              fontWeight: FontWeight.w600,
              fontSize: 14,
              textAlign: TextAlign.center,
            ),
            if (!hasImage) ...[
              const Gap(height: 4),
              const AppText(
                data: 'Tap to upload a clear photo',
                color: Color(0xFF60A5FA),
                fontSize: 12,
                textAlign: TextAlign.center,
              ),
            ]
          ],
        ),
      ),
    );
  }
}
