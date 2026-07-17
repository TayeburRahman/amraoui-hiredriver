import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CancelSuccessScreen extends StatelessWidget {
  final String reqId;

  const CancelSuccessScreen({super.key, required this.reqId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 20)),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Spacer(),
              Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF1F2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.warning_amber_rounded,
                  color: Color(0xFFEF4444),
                  size: 32,
                ),
              ),
              const Gap(height: 24),
              const AppText(
                data: 'Mission cancelled',
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 12),
              const AppText(
                data: 'This mission has been cancelled successfully.',
                fontSize: 14,
                color: Color(0xFF64748B),
                textAlign: TextAlign.center,
              ),
              const Gap(height: 24),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 20),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const AppText(
                      data: 'Cancellation fee may apply: ',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0F172A),
                    ),
                    const AppText(
                      data: '€50',
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFEF4444),
                    ),
                  ],
                ),
              ),
              const Gap(height: 24),
              AppText(
                data: 'Mission ID: $reqId',
                fontSize: 13,
                color: const Color(0xFF94A3B8),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0EA5E9),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  onPressed: () {
                    Get.offAllNamed('/navigationScreen');
                  },
                  child: const AppText(
                    data: 'Back to Dashboard',
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
              ),
              const Gap(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
