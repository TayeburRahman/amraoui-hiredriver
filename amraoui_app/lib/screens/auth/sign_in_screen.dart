import 'package:amraoui_app/const/images/app_asset_images.dart';
import 'package:amraoui_app/screens/auth/controllers/sign_in_controller.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/inputs/app_input_widget.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SignInScreen extends StatelessWidget {
  const SignInScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SignInController());
    AppSize.size = MediaQuery.of(context).size;

    return SafeArea(
      top: false,
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Image Header with Language Selector
              Stack(
                children: [
                  ClipPath(
                    clipper: _CustomHeaderClipper(),
                    child: Container(
                      height: AppSize.size.height * 0.35,
                      width: double.infinity,
                      decoration: const BoxDecoration(color: Colors.white),
                      child: Image.asset(
                        AssetsImagesPath.loginImage,
                        fit: BoxFit.cover,
                        alignment: Alignment.centerRight,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: const Color(0xFFEAF2FF),
                            child: const Icon(
                              Icons.local_shipping,
                              size: 80,
                              color: Colors.white,
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  Positioned(
                    top: MediaQuery.of(context).padding.top + 16,
                    right: 20,
                    child: Obx(
                      () => PopupMenuButton<String>(
                        onSelected: controller.changeLanguage,
                        color: Colors.white,
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'EN',
                            child: Text(
                              'English',
                              style: TextStyle(
                                fontFamily: 'Manrope',
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'DU',
                            child: Text(
                              'Dutch',
                              style: TextStyle(
                                fontFamily: 'Manrope',
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'FR',
                            child: Text(
                              'French',
                              style: TextStyle(
                                fontFamily: 'Manrope',
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.language,
                                size: 16,
                                color: Color(0xFF64748B),
                              ),
                              const Gap(width: 4),
                              AppText(
                                data: controller.currentLanguage.value,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF0F172A),
                              ),
                              const Gap(width: 2),
                              const Icon(
                                Icons.keyboard_arrow_down,
                                size: 14,
                                color: Color(0xFF64748B),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: AppSize.width(value: 24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Gap(height: 10),
                    const AppText(
                      data: 'Log In to access',
                      fontSize: 35,
                      fontWeight: FontWeight.w900,
                      fontStyle: FontStyle.italic,
                      color: Color(0xFF0F172A),
                      letterSpacing: -1.5,
                    ),
                    const Gap(height: 40),

                    // Email Field
                    const AppText(
                      data: 'Email',
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF334155),
                    ),
                    const Gap(height: 8),
                    AppInputWidget(
                      controller: controller.emailController,
                      hintText: 'Enter your email',
                      isEmail: true,
                      prefix: const Icon(
                        Icons.mail_outline,
                        color: Color(0xFF64748B),
                        size: 20,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),

                    const Gap(height: 20),

                    // Password Field
                    const AppText(
                      data: 'Password',
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF334155),
                    ),
                    const Gap(height: 8),
                    AppInputWidget(
                      controller: controller.passwordController,
                      hintText: 'Enter your password',
                      isPassWord: true,
                      prefix: const Icon(
                        Icons.lock_outline,
                        color: Color(0xFF64748B),
                        size: 20,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),

                    const Gap(height: 16),

                    // Remember Me & Forgot Password
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Obx(
                              () => SizedBox(
                                width: 24,
                                height: 24,
                                child: Checkbox(
                                  value: controller.rememberMe.value,
                                  onChanged: controller.toggleRememberMe,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  side: const BorderSide(
                                    color: Color(0xFF94A3B8),
                                  ),
                                  activeColor: const Color(0xFF2563EB),
                                ),
                              ),
                            ),
                            const Gap(width: 8),
                            const AppText(
                              data: 'Remember me',
                              color: Color(0xFF64748B),
                              fontSize: 14,
                            ),
                          ],
                        ),
                        GestureDetector(
                          onTap: controller.forgotPassword,
                          child: const AppText(
                            data: 'Forgot my password?',
                            color: Color(0xFF2563EB),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),

                    const Gap(height: 32),

                    // Log In Button
                    GestureDetector(
                      onTap: controller.login,
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
                          child: Obx(() => controller.isLoading.value
                              ? const SizedBox(
                                  height: 24,
                                  width: 24,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2.5,
                                  ),
                                )
                              : const AppText(
                                  data: 'Log In',
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                )),
                        ),
                      ),
                    ),

                    const Gap(height: 40),

                    // Sign Up Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const AppText(
                          data: "Don't have an account? ",
                          color: Color(0xFF64748B),
                          fontSize: 14,
                        ),
                        GestureDetector(
                          onTap: controller.navigateToSignUp,
                          child: const AppText(
                            data: 'Sign Up',
                            color: Color(0xFF2563EB),
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),

                    const Gap(height: 20),

                    // Privacy Policy
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.shield_outlined,
                          size: 14,
                          color: Color(0xFF94A3B8),
                        ),
                        const Gap(width: 4),
                        const AppText(
                          data: 'Privacy Policy',
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ],
                    ),

                    const Gap(height: 20),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Custom Clipper for the bottom curve of the header image
class _CustomHeaderClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    Path path = Path();
    // Start at top left
    path.lineTo(0, size.height * 0.7);

    // Curve down towards the bottom right
    path.quadraticBezierTo(
      size.width * 0.5,
      size.height * 0.8,
      size.width,
      size.height,
    );

    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) => false;
}
