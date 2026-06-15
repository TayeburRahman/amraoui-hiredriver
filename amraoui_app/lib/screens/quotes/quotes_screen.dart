import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/screens/missions/missions_screen.dart';

class QuotesController extends GetxController {
  var activeFilter = 'All'.obs;
  void setFilter(String filter) => activeFilter.value = filter;

  List<dynamic> get myQuotes {
    try {
      final missionsCtrl = Get.find<MissionsController>();
      return missionsCtrl.missions.where((m) => m['myQuoteStatus'] != null).toList();
    } catch (_) {
      return [];
    }
  }

  List<dynamic> get filteredQuotes {
    final list = myQuotes;
    if (activeFilter.value == 'All') return list;
    if (activeFilter.value == 'Accepted') return list.where((m) => m['myQuoteStatus']?.toString().toUpperCase() == 'ACCEPTED').toList();
    if (activeFilter.value == 'Rejected') return list.where((m) => m['myQuoteStatus']?.toString().toUpperCase() == 'REJECTED').toList();
    if (activeFilter.value == 'Pending') return list.where((m) => m['myQuoteStatus']?.toString().toUpperCase() == 'PENDING').toList();
    return list;
  }

  int get pendingCount => myQuotes.where((m) => m['myQuoteStatus']?.toString().toUpperCase() == 'PENDING').length;
  int get acceptedCount => myQuotes.where((m) => m['myQuoteStatus']?.toString().toUpperCase() == 'ACCEPTED').length;
  int get rejectedCount => myQuotes.where((m) => m['myQuoteStatus']?.toString().toUpperCase() == 'REJECTED').length;
}

class QuotesScreen extends StatelessWidget {
  const QuotesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(MissionsController()); // Ensure it's initialized
    final controller = Get.put(QuotesController());
    AppSize.size = MediaQuery.of(context).size;

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
        child: RefreshIndicator(
          onRefresh: () async {
            try {
              final missionsCtrl = Get.find<MissionsController>();
              await missionsCtrl.fetchMissions();
            } catch (_) {}
          },
          color: const Color(0xFF2563EB),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Gap(height: 16),
                _buildSummaryTiles(controller),
                const Gap(height: 32),
                _buildFilterChips(controller),
                const Gap(height: 24),
                _buildQuotesList(controller),
                const Gap(height: 100),
              ],
            ),
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
          data: 'My Quotes',
          fontSize: 32,
          fontWeight: FontWeight.w900,
          color: Color(0xFF0F172A),
        ),
        const AppText(
          data: 'Track your submitted mission quotes.',
          fontSize: 15,
          color: Color(0xFF64748B),
        ),
      ],
    );
  }

  Widget _buildSummaryTiles(QuotesController controller) {
    return Obx(() => Row(
      children: [
        _buildSummaryTile(controller.pendingCount.toString().padLeft(2, '0'), 'Pending', const Color(0xFFF59E0B)),
        const Gap(width: 12),
        _buildSummaryTile(controller.acceptedCount.toString().padLeft(2, '0'), 'Accepted', const Color(0xFF10B981)),
        const Gap(width: 12),
        _buildSummaryTile(controller.rejectedCount.toString().padLeft(2, '0'), 'Rejected', const Color(0xFFEF4444)),
      ],
    ));
  }

  Widget _buildSummaryTile(String count, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            AppText(
              data: count,
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: color,
            ),
            AppText(
              data: label,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF64748B),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChips(QuotesController controller) {
    final filters = ['All', 'Pending', 'Accepted', 'Rejected'];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Obx(
        () => Row(
          children: filters.map((filter) {
            final isActive = controller.activeFilter.value == filter;
            return GestureDetector(
              onTap: () => controller.setFilter(filter),
              child: Container(
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  gradient: isActive
                      ? const LinearGradient(
                          colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                        )
                      : null,
                  color: isActive ? null : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: isActive
                      ? null
                      : Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: AppText(
                  data: filter,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: isActive ? Colors.white : const Color(0xFF64748B),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildQuotesList(QuotesController controller) {
    return Obx(() {
      final list = controller.filteredQuotes;
      
      if (list.isEmpty) {
        return Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 40),
            child: Column(
              children: [
                Icon(Icons.inbox_outlined, size: 48, color: Colors.grey.shade300),
                const Gap(height: 16),
                AppText(
                  data: 'No quotes found',
                  fontSize: 16,
                  color: Colors.grey.shade500,
                ),
              ],
            ),
          ),
        );
      }

      return Column(
        children: list.map((m) {
          final id = m['displayId'] ?? 'ID N/A';
          final price = m['myQuoteAmount'] != null ? '€${m['myQuoteAmount']}' : '€0';
          
          String dateStr = 'N/A';
          if (m['createdAt'] != null) {
            try {
              final dt = DateTime.parse(m['createdAt']);
              final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              dateStr = '${dt.day} ${months[dt.month - 1]} ${dt.year}';
            } catch (_) {}
          }
          
          final pickup = m['pickupCity'] ?? m['pickupAddress'] ?? 'Pickup';
          final dropoff = m['dropoffCity'] ?? m['dropoffAddress'] ?? 'Dropoff';
          final route = '$pickup → $dropoff';
          
          final msg = m['myQuoteMessage'] ?? '';
          final time = m['myQuoteTime'] ?? '';
          final details = [
            if (msg.toString().trim().isNotEmpty) 'Notes: $msg',
            if (time.toString().trim().isNotEmpty) 'Est. Time: $time',
          ].join(' • ');

          final status = (m['myQuoteStatus'] ?? 'PENDING').toString().toUpperCase();
          Color statusBg = const Color(0xFFFFFBEB);
          Color statusText = const Color(0xFFF59E0B);
          String statusDisplay = 'Pending';
          
          if (status == 'ACCEPTED') {
            statusDisplay = 'Accepted';
            statusBg = const Color(0xFFF0FDF4);
            statusText = const Color(0xFF22C55E);
          } else if (status == 'REJECTED') {
            statusDisplay = 'Rejected';
            statusBg = const Color(0xFFFEF2F2);
            statusText = const Color(0xFFEF4444);
          }

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildQuoteCard(
              route: route,
              id: id,
              price: price,
              date: 'Created: $dateStr',
              details: details.isEmpty ? 'No extra details provided' : details,
              status: statusDisplay,
              statusBg: statusBg,
              statusText: statusText,
            ),
          );
        }).toList(),
      );
    });
  }

  Widget _buildQuoteCard({
    required String route,
    required String id,
    required String price,
    required String date,
    required String details,
    required String status,
    required Color statusBg,
    required Color statusText,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              AppText(data: route, fontSize: 18, fontWeight: FontWeight.w800),
              Row(
                children: [
                  AppText(
                    data: price,
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFF0F172A),
                  ),
                  const Gap(width: 8),
                  const Icon(
                    Icons.arrow_forward_ios,
                    size: 14,
                    color: Color(0xFF94A3B8),
                  ),
                ],
              ),
            ],
          ),
          AppText(data: id, fontSize: 13, color: const Color(0xFF94A3B8)),
          const Gap(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              AppText(data: date, fontSize: 13, color: const Color(0xFF64748B)),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: AppText(
                  data: status,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: statusText,
                ),
              ),
            ],
          ),
          const Gap(height: 16),
          const Divider(color: Color(0xFFF1F5F9)),
          const Gap(height: 12),
          AppText(data: details, fontSize: 13, color: const Color(0xFF64748B)),
        ],
      ),
    );
  }
}
