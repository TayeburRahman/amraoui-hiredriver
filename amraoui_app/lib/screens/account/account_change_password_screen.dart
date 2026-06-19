import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/app_snack_bar/app_snack_bar.dart';
import 'package:amraoui_app/widgets/inputs/app_input_widget.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AccountChangePasswordScreen extends StatefulWidget {
  const AccountChangePasswordScreen({super.key});

  @override
  State<AccountChangePasswordScreen> createState() => _AccountChangePasswordScreenState();
}

class _AccountChangePasswordScreenState extends State<AccountChangePasswordScreen> {
  final _currentController = TextEditingController();
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();

  bool _isLoading = false;
  final AuthRepository _repository = AuthRepository();

  @override
  void dispose() {
    _currentController.dispose();
    _newController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (_currentController.text.isEmpty || _newController.text.isEmpty || _confirmController.text.isEmpty) {
      AppSnackBar.error('Please fill all fields');
      return;
    }
    if (_newController.text != _confirmController.text) {
      AppSnackBar.error('Passwords do not match');
      return;
    }
    if (_newController.text.length < 6) {
      AppSnackBar.error('Password must be at least 6 characters');
      return;
    }
    
    setState(() {
      _isLoading = true;
    });
    
    try {
      final res = await _repository.changePassword(
        oldPassword: _currentController.text,
        newPassword: _newController.text,
        confirmPassword: _confirmController.text,
      );
      
      if (res != null && res['success'] == true) {
        AppSnackBar.success('Password updated successfully');
        Get.back();
      } else {
        AppSnackBar.error(res?['message'] ?? 'Failed to update password');
      }
    } catch (e) {
      final msg = e.toString().replaceAll('Exception: ', '');
      AppSnackBar.error(msg);
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AccountSubPageLayout(
      title: 'Change Password',
      subtitle: 'Update your account password.',
      child: Column(
        children: [
          AppInputWidget(
            controller: _currentController,
            hintText: 'Current password',
            isPassWord: true,
          ),
          const Gap(height: 16),
          AppInputWidget(
            controller: _newController,
            hintText: 'New password',
            isPassWord: true,
          ),
          const Gap(height: 16),
          AppInputWidget(
            controller: _confirmController,
            hintText: 'Confirm new password',
            isPassWord: true,
          ),
          const Gap(height: 24),
          GestureDetector(
            onTap: _submit,
            child: Container(
              width: double.infinity,
              height: 52,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                ),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Center(
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const AppText(
                        data: 'Update Password',
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
