import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/layout/account_sub_page_layout.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

class InvoicesScreen extends StatelessWidget {
  const InvoicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AccountSubPageLayout(
      title: 'Invoices / Commission',
      subtitle: 'Track your earnings and commission payments.',
      child: Column(
        children: [
          _summaryCard('Total Earnings', '€2,840', const Color(0xFF2563EB)),
          const Gap(height: 12),
          _summaryCard('This Month', '€420', const Color(0xFF10B981)),
          const Gap(height: 24),
          _invoiceTile('#INV-1042', 'Paris → Lyon', '€46', 'Paid'),
          const Gap(height: 12),
          _invoiceTile('#INV-1038', 'Marseille → Nice', '€72', 'Pending'),
        ],
      ),
    );
  }

  Widget _summaryCard(String label, String amount, Color color) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
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
            data: amount,
            fontSize: 28,
            fontWeight: FontWeight.w900,
            color: color,
          ),
        ],
      ),
    );
  }

  Widget _invoiceTile(String id, String route, String amount, String status) {
    final isPaid = status == 'Paid';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppText(data: id, fontSize: 13, color: const Color(0xFF94A3B8)),
                AppText(data: route, fontSize: 16, fontWeight: FontWeight.w700),
                AppText(data: amount, fontSize: 18, fontWeight: FontWeight.w900),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isPaid ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
              borderRadius: BorderRadius.circular(12),
            ),
            child: AppText(
              data: status,
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: isPaid ? const Color(0xFF16A34A) : const Color(0xFFF59E0B),
            ),
          ),
        ],
      ),
    );
  }
}
