import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/widgets/dialog_boxes/log_out_dailog.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'controllers/account_controller.dart';

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    AppSize.size = MediaQuery.of(context).size;
    final AccountController controller = Get.put(AccountController());

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(80),
        child: AppBar(
          backgroundColor: const Color(0xFFF8FAFC),
          elevation: 0,
          scrolledUnderElevation: 0,
          automaticallyImplyLeading: false,
          flexibleSpace: SafeArea(
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: AppSize.width(value: 24),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [_buildHeader(), const Gap(height: 8)],
              ),
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Gap(height: 16),
              _buildProfileCard(controller),
              const Gap(height: 32),
              _buildSectionTitle('Work & Earnings'),
              const Gap(height: 16),
              _buildMenuItem(
                icon: Icons.receipt_long_outlined,
                iconColor: const Color(0xFF6366F1),
                iconBgColor: const Color(0xFFEEF2FF),
                title: 'Invoices / Commission',
                subtitle: 'Track earnings and payments',
                onTap: () => Get.toNamed(AppRoutes.invoices),
              ),
              const Gap(height: 12),
              _buildMenuItem(
                icon: Icons.military_tech_outlined,
                iconColor: const Color(0xFF10B981),
                iconBgColor: const Color(0xFFECFDF5),
                title: 'Skills Overview',
                subtitle: 'Your qualifications',
                onTap: () => Get.toNamed(AppRoutes.skillsOverview),
              ),
              const Gap(height: 32),
              _buildSectionTitle('Account Settings'),
              const Gap(height: 16),
              _buildMenuItem(
                icon: Icons.person_outline,
                iconColor: const Color(0xFF475569),
                iconBgColor: const Color(0xFFF1F5F9),
                title: 'Profile',
                subtitle: 'View your details',
                onTap: () => Get.toNamed(AppRoutes.profile),
              ),
              const Gap(height: 12),
              _buildMenuItem(
                icon: Icons.description_outlined,
                iconColor: const Color(0xFF475569),
                iconBgColor: const Color(0xFFF1F5F9),
                title: 'Documents',
                subtitle: 'View your papers in details',
                onTap: () => Get.toNamed(AppRoutes.documents),
              ),
              const Gap(height: 12),
              _buildMenuItem(
                icon: Icons.language_outlined,
                iconColor: const Color(0xFF475569),
                iconBgColor: const Color(0xFFF1F5F9),
                title: 'Language',
                subtitle: 'English',
                onTap: () => Get.toNamed(AppRoutes.language),
              ),
              const Gap(height: 12),
              _buildMenuItem(
                icon: Icons.lock_outline,
                iconColor: const Color(0xFF475569),
                iconBgColor: const Color(0xFFF1F5F9),
                title: 'Change Password',
                subtitle: 'Update your password',
                onTap: () => Get.toNamed(AppRoutes.accountChangePassword),
              ),
              const Gap(height: 12),
              _buildMenuItem(
                icon: Icons.help_outline,
                iconColor: const Color(0xFF475569),
                iconBgColor: const Color(0xFFF1F5F9),
                title: 'Help / Support',
                subtitle: 'Contact support team',
                onTap: () => Get.toNamed(AppRoutes.helpSupport),
              ),
              const Gap(height: 24),
              _buildLogoutButton(),
              const Gap(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppText(
          data: 'My Account',
          fontSize: 32,
          fontWeight: FontWeight.w900,
          color: Color(0xFF0F172A),
        ),
        const AppText(
          data: 'Manage your driver profile and settings.',
          fontSize: 15,
          color: Color(0xFF64748B),
        ),
      ],
    );
  }

  Widget _buildProfileCard(AccountController controller) {
    return Obx(() {
      if (controller.isLoading.value) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 15,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: const Center(child: CircularProgressIndicator()),
        );
      }
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GestureDetector(
                  onTap: () => controller.pickAndUploadImage(),
                  child: Stack(
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFFE2E8F0),
                        ),
                        child: controller.profileImage.value.isNotEmpty
                            ? ClipOval(
                                child: CachedNetworkImage(
                                  imageUrl: controller.profileImage.value,
                                  fit: BoxFit.cover,
                                  placeholder: (context, url) => const CircularProgressIndicator(),
                                  errorWidget: (context, url, error) => const Icon(Icons.person, size: 40, color: Color(0xFF94A3B8)),
                                ),
                              )
                            : const Icon(
                                Icons.person,
                                size: 40,
                                color: Color(0xFF94A3B8),
                              ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Color(0xFF2563EB),
                            shape: BoxShape.circle,
                          ),
                          child: controller.isUploading.value
                              ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : const Icon(
                                  Icons.camera_alt,
                                  color: Colors.white,
                                  size: 14,
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
                const Gap(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppText(
                        data: controller.name.value,
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF0F172A),
                      ),
                      const Gap(height: 4),
                      AppText(
                        data: controller.email.value,
                        fontSize: 14,
                        color: const Color(0xFF64748B),
                      ),
                      if (controller.phone.value.isNotEmpty) ...[
                        AppText(
                          data: controller.phone.value,
                          fontSize: 14,
                          color: const Color(0xFF64748B),
                        ),
                      ],
                      const Gap(height: 12),
                      if (controller.isVerified.value) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF16A34A),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const Gap(width: 6),
                              const AppText(
                                data: 'Verified Driver',
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF16A34A),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
            const Gap(height: 24),
            const Divider(color: Color(0xFFF1F5F9), thickness: 1.5),
            const Gap(height: 20),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const AppText(
                        data: 'Completed Jobs',
                        fontSize: 13,
                        color: Color(0xFF64748B),
                      ),
                      const Gap(height: 4),
                      AppText(
                        data: controller.completedJobs.value.toString(),
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: const Color(0xFF0F172A),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const AppText(
                        data: 'Rating',
                        fontSize: 13,
                        color: Color(0xFF64748B),
                      ),
                      const Gap(height: 4),
                      Row(
                        children: [
                          AppText(
                            data: controller.rating.value.toStringAsFixed(1),
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: const Color(0xFF0F172A),
                          ),
                          const Gap(width: 4),
                          const Icon(
                            Icons.star,
                            color: Color(0xFFFBBF24),
                            size: 24,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    });
  }

  Widget _buildSectionTitle(String title) {
    return AppText(
      data: title,
      fontSize: 16,
      fontWeight: FontWeight.w800,
      color: const Color(0xFF475569),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const Gap(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppText(
                  data: title,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
                const Gap(height: 2),
                AppText(
                  data: subtitle,
                  fontSize: 13,
                  color: const Color(0xFF64748B),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.arrow_forward_ios,
            size: 16,
            color: Color(0xFFCBD5E1),
          ),
        ],
      ),
    ),
    );
  }

  Widget _buildLogoutButton() {
    return GestureDetector(
      onTap: logOutDialog,
      behavior: HitTestBehavior.opaque,
      child: Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFFECACA)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.logout, color: Color(0xFFEF4444), size: 24),
              const Gap(width: 16),
              const AppText(
                data: 'Logout',
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFFEF4444),
              ),
            ],
          ),
          const Icon(
            Icons.arrow_forward_ios,
            size: 16,
            color: Color(0xFFFCA5A5),
          ),
        ],
      ),
    ),
    );
  }
}
