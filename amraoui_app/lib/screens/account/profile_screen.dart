import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/layout/account_sub_page_layout.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'controllers/account_controller.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final AccountController controller = Get.find<AccountController>();

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showEditProfileDialog(context, controller),
        backgroundColor: const Color(0xFF2563EB),
        child: const Icon(Icons.edit, color: Colors.white),
      ),
      body: AccountSubPageLayout(
        title: 'Profile',
        subtitle: 'View and manage your personal details.',
        child: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }

          return Column(
            children: [
              _infoCard(
                'Full Name',
                controller.name.value.isNotEmpty
                    ? controller.name.value
                    : 'Not provided',
              ),
              const Gap(height: 12),
              _infoCard(
                'Email',
                controller.email.value.isNotEmpty
                    ? controller.email.value
                    : 'Not provided',
              ),
              const Gap(height: 12),
              _infoCard(
                'Phone',
                controller.phone.value.isNotEmpty
                    ? controller.phone.value
                    : 'Not provided',
              ),
              const Gap(height: 12),
              _infoCard(
                'Address',
                controller.address.value.isNotEmpty
                    ? controller.address.value
                    : 'Not provided',
              ),
              const Gap(height: 12),
              _infoCard(
                'Date of Birth',
                controller.dateOfBirth.value.isNotEmpty
                    ? controller.dateOfBirth.value
                    : 'Not provided',
              ),
              const Gap(height: 12),
              _infoCard(
                'Driver Status',
                controller.isVerified.value
                    ? 'Verified Driver'
                    : 'Pending Verification',
              ),
            ],
          );
        }),
      ),
    );
  }

  void _showEditProfileDialog(
    BuildContext context,
    AccountController controller,
  ) {
    final TextEditingController nameController = TextEditingController(
      text: controller.name.value,
    );
    final TextEditingController phoneController = TextEditingController(
      text: controller.phone.value,
    );
    final TextEditingController addressController = TextEditingController(
      text: controller.address.value,
    );
    final TextEditingController dobController = TextEditingController(
      text: controller.dateOfBirth.value,
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 24,
            right: 24,
            top: 24,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const Gap(height: 24),
                const AppText(
                  data: 'Edit Profile',
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
                const Gap(height: 8),
                const AppText(
                  data: 'Update your personal details below.',
                  fontSize: 14,
                  color: Color(0xFF64748B),
                ),
                const Gap(height: 24),
                _buildModernTextField(
                  controller: nameController,
                  label: 'Full Name',
                  icon: Icons.person_outline,
                ),
                const Gap(height: 16),
                _buildModernTextField(
                  controller: phoneController,
                  label: 'Phone Number',
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                ),
                const Gap(height: 16),
                _buildModernTextField(
                  controller: addressController,
                  label: 'Address',
                  icon: Icons.location_on_outlined,
                ),
                const Gap(height: 16),
                _buildModernTextField(
                  controller: dobController,
                  label: 'Date of Birth',
                  icon: Icons.calendar_today_outlined,
                ),
                const Gap(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: Obx(
                    () => ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      onPressed: controller.isUpdatingProfile.value
                          ? null
                          : () async {
                              final success = await controller
                                  .updateProfileDetails({
                                    'name': nameController.text.trim(),
                                    'phone_number': phoneController.text.trim(),
                                    'address': addressController.text.trim(),
                                    'dateOfBirth': dobController.text.trim(),
                                  });
                              if (success) {
                                Navigator.pop(context);
                              }
                            },
                      child: controller.isUpdatingProfile.value
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const AppText(
                              data: 'Save Changes',
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                    ),
                  ),
                ),
                const Gap(height: 32),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildModernTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: const TextStyle(
        fontSize: 16,
        color: Color(0xFF0F172A),
        fontWeight: FontWeight.w500,
      ),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 14),
        prefixIcon: Icon(icon, color: const Color(0xFF94A3B8)),
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF2563EB), width: 1.5),
        ),
      ),
    );
  }

  Widget _infoCard(String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppText(data: label, fontSize: 13, color: const Color(0xFF64748B)),
          const Gap(height: 4),
          AppText(
            data: value,
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF0F172A),
          ),
        ],
      ),
    );
  }
}
