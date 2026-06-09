import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/screens/navigation/controllers/navigation_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(100),
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
              _buildStatusChip(),
              const Gap(height: 32),
              _buildSummaryGrid(),
              const Gap(height: 32),
              const AppText(
                data: 'Active Mission',
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 16),
              _buildActiveMissionCard(),
              const Gap(height: 32),
              const AppText(
                data: 'Recent Quotes',
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 16),
              _buildRecentQuotesList(),
              const Gap(height: 100), // Spacing for bottom nav
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const AppText(
              data: 'Good morning,',
              fontSize: 14,
              color: Color(0xFF64748B),
            ),
            const AppText(
              data: 'Alex Martin',
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
            const Gap(height: 4),
            const AppText(
              data: "Ready for today's missions?",
              fontSize: 14,
              color: Color(0xFF64748B),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Stack(
            children: [
              const Icon(
                Icons.notifications_outlined,
                color: Color(0xFF0F172A),
              ),
              Positioned(
                right: 2,
                top: 2,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatusChip() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: const BoxDecoration(
              color: Color(0xFF22C55E),
              shape: BoxShape.circle,
            ),
          ),
          const Gap(width: 8),
          const AppText(
            data: 'Available for missions',
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Color(0xFF166534),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.1,
      children: [
        _buildSummaryCard(
          title: 'Available missions',
          count: '12',
          subtitle: 'New tasks nearby',
          icon: Icons.assignment_outlined,
          iconColor: const Color(0xFF2563EB),
          bgColor: const Color(0xFFEFF6FF),
          onTap: () => _switchTab(1),
        ),
        _buildSummaryCard(
          title: 'Assigned missions',
          count: '03',
          subtitle: 'Ready to start',
          icon: Icons.account_tree_outlined,
          iconColor: const Color(0xFF10B981),
          bgColor: const Color(0xFFECFDF5),
          onTap: () => _switchTab(1),
        ),
        _buildSummaryCard(
          title: 'Pending quotes',
          count: '05',
          subtitle: 'Waiting approval',
          icon: Icons.description_outlined,
          iconColor: const Color(0xFFF59E0B),
          bgColor: const Color(0xFFFFFBEB),
          onTap: () => _switchTab(2),
        ),
        _buildSummaryCard(
          title: 'Completed jobs',
          count: '28',
          subtitle: 'This month',
          icon: Icons.check_circle_outline,
          iconColor: const Color(0xFF22C55E),
          bgColor: const Color(0xFFF0FDF4),
          onTap: () => _switchTab(1),
        ),
      ],
    );
  }

  void _switchTab(int index) {
    if (Get.isRegistered<NavigationController>()) {
      Get.find<NavigationController>().changeIndex(index);
    }
  }

  void _openMissionDetail() {
    Get.toNamed(AppRoutes.detail, arguments: {
      'title': 'Mission Details',
      'subtitle': '#MS-20458',
      'fields': {
        'Route': 'Paris → Lyon',
        'Vehicle': 'BMW X5 • AB-123-CD',
        'Pickup time': 'Today, 10:30 AM',
        'Mission price': '€46',
        'Status': 'Assigned',
      },
    });
  }

  Widget _buildSummaryCard({
    required String title,
    required String count,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const Spacer(),
          AppText(
            data: count,
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: const Color(0xFF0F172A),
          ),
          const Gap(height: 4),
          AppText(
            data: title,
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF475569),
          ),
          AppText(data: subtitle, fontSize: 11, color: const Color(0xFF94A3B8)),
        ],
      ),
    ),
    );
  }

  Widget _buildActiveMissionCard() {
    return Container(
      padding: const EdgeInsets.all(20),
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const AppText(
                data: '#MS-20458',
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const AppText(
                  data: 'Assigned',
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF2563EB),
                ),
              ),
            ],
          ),
          const Gap(height: 20),
          Row(
            children: [
              const Icon(Icons.location_on, color: Color(0xFF2563EB), size: 20),
              const Gap(width: 8),
              const AppText(data: 'Paris', fontWeight: FontWeight.w700),
              const Expanded(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12),
                  child: Divider(color: Color(0xFFE2E8F0), thickness: 2),
                ),
              ),
              const Icon(Icons.location_on, color: Color(0xFF06B6D4), size: 20),
              const Gap(width: 8),
              const AppText(data: 'Lyon', fontWeight: FontWeight.w700),
            ],
          ),
          const Gap(height: 24),
          _buildInfoRow('Vehicle', 'BMW X5 • AB-123-CD'),
          const Gap(height: 12),
          _buildInfoRow('Pickup time', 'Today, 10:30 AM'),
          const Gap(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const AppText(data: 'Mission price', color: Color(0xFF64748B)),
              const AppText(
                data: '€46',
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: Color(0xFF2563EB),
              ),
            ],
          ),
          const Gap(height: 20),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.phone_in_talk,
                  size: 16,
                  color: Color(0xFF64748B),
                ),
                const Gap(width: 12),
                const AppText(
                  data: 'Call before pickup',
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF475569),
                ),
              ],
            ),
          ),
          const Gap(height: 20),
          Row(
            children: [
              Expanded(
                flex: 2,
                child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(
                    child: AppText(
                      data: 'Start Mission',
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const Gap(width: 12),
              Expanded(
                child: GestureDetector(
                  onTap: _openMissionDetail,
                  child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(
                    child: AppText(
                      data: 'View Details',
                      color: Color(0xFF0F172A),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        AppText(data: label, fontSize: 14, color: const Color(0xFF64748B)),
        AppText(
          data: value,
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF0F172A),
        ),
      ],
    );
  }

  Widget _buildRecentQuotesList() {
    return Column(
      children: [
        _buildQuoteItem(
          'Marseille → Nice',
          'Audi A4',
          '€72',
          'Pending',
          const Color(0xFFFFFBEB),
          const Color(0xFFF59E0B),
        ),
        const Gap(height: 12),
        _buildQuoteItem(
          'Paris → Lille',
          'Tesla Model 3',
          '€95',
          'Accepted',
          const Color(0xFFF0FDF4),
          const Color(0xFF22C55E),
        ),
      ],
    );
  }

  Widget _buildQuoteItem(
    String route,
    String car,
    String price,
    String status,
    Color statusBg,
    Color statusText,
  ) {
    return GestureDetector(
      onTap: () => Get.toNamed(AppRoutes.detail, arguments: {
        'title': 'Quote Details',
        'subtitle': route,
        'fields': {
          'Vehicle': car,
          'Price': price,
          'Status': status,
        },
      }),
      behavior: HitTestBehavior.opaque,
      child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.account_tree_outlined,
              color: Color(0xFF2563EB),
              size: 20,
            ),
          ),
          const Gap(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppText(data: route, fontSize: 15, fontWeight: FontWeight.w800),
                AppText(
                  data: car,
                  fontSize: 13,
                  color: const Color(0xFF64748B),
                ),
                const Gap(height: 4),
                AppText(
                  data: price,
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF0F172A),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: statusBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: AppText(
              data: status,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: statusText,
            ),
          ),
        ],
      ),
    ),
    );
  }
}
