import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MissionsController extends GetxController {
  var activeMainTab = 0.obs; // 0: Open Missions, 1: My Missions
  var activeFilter = 'All'.obs;

  void setMainTab(int index) => activeMainTab.value = index;
  void setFilter(String filter) => activeFilter.value = filter;
}

class MissionsScreen extends StatelessWidget {
  const MissionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(MissionsController());
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(
                  horizontal: AppSize.width(value: 24),
                ),
                child: Column(
                  children: [
                    const Gap(height: 24),
                    _buildSearchBar(),
                    const Gap(height: 24),
                    _buildMainTabs(controller),
                    const Gap(height: 24),
                    _buildFilterChips(controller),
                    const Gap(height: 24),
                    _buildMissionsList(controller),
                    const Gap(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: EdgeInsets.fromLTRB(
        AppSize.width(value: 24),
        16,
        AppSize.width(value: 24),
        0,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const AppText(
                data: 'Missions',
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
              const AppText(
                data: 'All yours missions here',
                fontSize: 15,
                color: Color(0xFF64748B),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Icon(Icons.tune, color: Color(0xFF0F172A), size: 22),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: const TextField(
        decoration: InputDecoration(
          icon: Icon(Icons.search, color: Color(0xFF94A3B8)),
          hintText: 'Search by city, vehicle, or mission ID',
          hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    );
  }

  Widget _buildMainTabs(MissionsController controller) {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Obx(
        () => Row(
          children: [
            _buildTabItem(
              title: 'Open Missions',
              isActive: controller.activeMainTab.value == 0,
              onTap: () => controller.setMainTab(0),
            ),
            _buildTabItem(
              title: 'My Missions',
              isActive: controller.activeMainTab.value == 1,
              onTap: () => controller.setMainTab(1),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabItem({
    required String title,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            gradient: isActive
                ? const LinearGradient(
                    colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
                  )
                : null,
            color: isActive ? null : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: AppText(
              data: title,
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: isActive ? Colors.white : const Color(0xFF64748B),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChips(MissionsController controller) {
    final filters = ['All', 'New', 'Pending', 'Rejected'];
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

  Widget _buildMissionsList(MissionsController controller) {
    return Obx(() {
      if (controller.activeMainTab.value == 0) {
        return Column(
          children: [
            _buildMissionCard(
              route: 'Paris → Lyon',
              id: '#MS-20458',
              price: '€72',
              date: 'Submitted: Today, 10:45 AM',
              details: 'Service €46 • Expenses €26',
              status: 'New',
              statusBg: const Color(0xFFEFF6FF),
              statusText: const Color(0xFF2563EB),
            ),
            const Gap(height: 16),
            _buildMissionCard(
              route: 'Strasbourg → Metz',
              id: '#MS-20399',
              price: '€38',
              date: 'Submitted: 20 Apr 2026',
              details: 'Service €28 • Expenses €10',
              status: 'Pending',
              statusBg: const Color(0xFFFFFBEB),
              statusText: const Color(0xFFF59E0B),
            ),
          ],
        );
      } else {
        return Column(
          children: [
            _buildMissionCard(
              route: 'Lyon → Marseille',
              id: '#MS-19882',
              price: '€55',
              date: 'Submitted: Yesterday',
              details: 'Service €35 • Expenses €20',
              status: 'Accepted',
              statusBg: const Color(0xFFF0FDF4),
              statusText: const Color(0xFF22C55E),
            ),
          ],
        );
      }
    });
  }

  Widget _buildMissionCard({
    required String route,
    required String id,
    required String price,
    required String date,
    required String details,
    required String status,
    required Color statusBg,
    required Color statusText,
  }) {
    return GestureDetector(
      onTap: () => Get.toNamed(AppRoutes.detail, arguments: {
        'title': 'Mission Details',
        'subtitle': id,
        'fields': {
          'Route': route,
          'Price': price,
          'Submitted': date,
          'Breakdown': details,
          'Status': status,
        },
      }),
      behavior: HitTestBehavior.opaque,
      child: Container(
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
    ),
    );
  }
}
