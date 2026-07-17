import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/layout/account_sub_page_layout.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'controllers/invoices_controller.dart';

class InvoicesScreen extends StatelessWidget {
  const InvoicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final InvoicesController controller = Get.put(InvoicesController());

    return AccountSubPageLayout(
      title: 'Invoices / Commission',
      subtitle: 'Track your earnings and commission payments.',
      child: Obx(() {
        if (controller.isLoading.value) {
          return const Padding(
            padding: EdgeInsets.all(32.0),
            child: Center(child: CircularProgressIndicator()),
          );
        }

        return Column(
          children: [
            _summaryCard(
              'Total Earnings',
              '€${controller.totalEarnings.value.toStringAsFixed(2)}',
              const Color(0xFF2563EB),
            ),
            const Gap(height: 12),
            _summaryCard(
              'This Month',
              '€${controller.thisMonthEarnings.value.toStringAsFixed(2)}',
              const Color(0xFF10B981),
            ),
            const Gap(height: 24),
            if (controller.completedMissions.isEmpty)
              const Padding(
                padding: EdgeInsets.all(32.0),
                child: AppText(
                  data: 'No completed missions yet.',
                  fontSize: 16,
                  color: Color(0xFF64748B),
                ),
              )
            else
              ...controller.completedMissions.map((mission) {
                // Extract mission details
                final idStr = mission['_id']
                    .toString()
                    .substring(0, 6)
                    .toUpperCase();

                String route = 'Mission';
                if (mission['type'] == 'TRANSPORT' &&
                    mission['detailsObj'] != null) {
                  final pickupCity =
                      mission['detailsObj']['pickupLocation']?['city'] ??
                      'Unknown';
                  final deliveryCity =
                      mission['detailsObj']['deliveryLocation']?['city'] ??
                      'Unknown';
                  route = '$pickupCity → $deliveryCity';
                } else if (mission['type'] == 'INSPECTION' ||
                    mission['type'] == 'HIRE_DRIVER') {
                  route = mission['type'];
                }

                double amount = 0.0;
                if (mission['driverQuotes'] != null) {
                  for (var quote in mission['driverQuotes']) {
                    if (quote['status'] == 'ACCEPTED') {
                      amount = (quote['amount'] as num).toDouble();
                      break;
                    }
                  }
                }

                String cStatus =
                    mission['commissionStatus']?.toString().toUpperCase() ??
                    'PENDING';
                String displayStatus = cStatus == 'PAID' ? 'Paid' : 'Pending';

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _invoiceTile(
                    '#INV-$idStr',
                    route,
                    '€${amount.toStringAsFixed(2)}',
                    displayStatus,
                  ),
                );
              }),
          ],
        );
      }),
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
                AppText(
                  data: amount,
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
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
