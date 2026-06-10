import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MissionsController extends GetxController {
  var activeMainTab = 0.obs; // 0: Open Missions, 1: My Missions
  var activeFilter = 'All'.obs;
  
  var isLoading = true.obs;
  var missions = [].obs;

  final MissionRepository _repo = MissionRepository();

  @override
  void onInit() {
    super.onInit();
    fetchMissions();
  }

  Future<void> fetchMissions() async {
    try {
      isLoading(true);
      final res = await _repo.getMissions();
      if (res.data != null && res.data['success'] == true) {
        missions.value = res.data['data'];
      }
    } catch (e) {
      print("Error fetching missions: $e");
    } finally {
      isLoading(false);
    }
  }

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
      if (controller.isLoading.value) {
        return const Center(child: CircularProgressIndicator());
      }
      
      final isMyMissions = controller.activeMainTab.value == 1;
      
      // Basic filter logic
      final filteredMissions = controller.missions.where((m) {
        // Driver assigned checking would typically be matched with logged-in user id
        // Assuming "assignedDriverId" is not null for 'My Missions' 
        final isAssigned = m['assignedDriverId'] != null;
        if (isMyMissions && !isAssigned) return false;
        if (!isMyMissions && isAssigned) return false;

        // Apply string filters (All, New, Pending, Rejected)
        if (controller.activeFilter.value != 'All') {
          // Simplistic mapping
        }
        return true;
      }).toList();

      if (filteredMissions.isEmpty) {
        return Padding(
          padding: const EdgeInsets.only(top: 40),
          child: AppText(
            data: 'No missions found',
            fontSize: 14,
            color: const Color(0xFF64748B),
          ),
        );
      }

      return Column(
        children: filteredMissions.map((m) {
          final id = '#REQ-${(m['_id'] as String).substring((m['_id'] as String).length - 5).toUpperCase()}';
          final realId = m['_id'];
          final type = m['type'];
          String route = 'Transport';
          if (type == 'TRANSPORT') {
            route = '${m['details']['pickupCity'] ?? 'N/A'} → ${m['details']['dropoffCity'] ?? 'N/A'}';
          } else if (type == 'HIRE_DRIVER') {
            route = m['details']['driverCity'] ?? 'N/A';
          } else if (type == 'INSPECTION') {
            route = m['details']['inspectionLocation'] ?? 'N/A';
          }

          final date = DateTime.parse(m['createdAt'] ?? DateTime.now().toIso8601String());
          final dateStr = '${date.day}/${date.month}/${date.year}';
          final price = m['adminQuote'] != null ? '€${m['adminQuote']['amount']}' : 'Pending';

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildMissionCard(
              route: route,
              id: id,
              realId: realId,
              price: price,
              date: 'Submitted: $dateStr',
              details: type == 'TRANSPORT' ? '${m['details']['make']} ${m['details']['model']}' : type,
              status: isMyMissions ? 'Assigned' : 'Open',
              statusBg: isMyMissions ? const Color(0xFFF0FDF4) : const Color(0xFFEFF6FF),
              statusText: isMyMissions ? const Color(0xFF22C55E) : const Color(0xFF2563EB),
            ),
          );
        }).toList(),
      );
    });
  }

  Widget _buildMissionCard({
    required String route,
    required String id,
    required String realId,
    required String price,
    required String date,
    required String details,
    required String status,
    required Color statusBg,
    required Color statusText,
  }) {
    return GestureDetector(
      onTap: () => _showQuoteDialog(realId, id),
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

  void _showQuoteDialog(String missionId, String displayId) {
    final amountCtrl = TextEditingController();
    final notesCtrl = TextEditingController();
    final timeCtrl = TextEditingController();

    Get.bottomSheet(
      Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AppText(data: 'Submit Quote for $displayId', fontSize: 20, fontWeight: FontWeight.bold),
              const Gap(height: 16),
              TextField(
                controller: amountCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Amount (€)', border: OutlineInputBorder()),
              ),
              const Gap(height: 12),
              TextField(
                controller: notesCtrl,
                decoration: const InputDecoration(labelText: 'Message / Notes', border: OutlineInputBorder()),
                maxLines: 2,
              ),
              const Gap(height: 12),
              TextField(
                controller: timeCtrl,
                decoration: const InputDecoration(labelText: 'Estimated Time (e.g., 2 hours)', border: OutlineInputBorder()),
              ),
              const Gap(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB)),
                  onPressed: () async {
                    if (amountCtrl.text.isEmpty) return;
                    Get.back();
                    Get.snackbar('Submitting...', 'Sending your quote');
                    try {
                      final repo = MissionRepository();
                      await repo.submitQuote(
                        missionId, 
                        double.parse(amountCtrl.text), 
                        notesCtrl.text, 
                        timeCtrl.text,
                      );
                      Get.snackbar('Success', 'Quote submitted successfully');
                      Get.find<MissionsController>().fetchMissions();
                    } catch (e) {
                      Get.snackbar('Error', 'Failed to submit quote');
                    }
                  },
                  child: const AppText(data: 'Submit Quote', color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
      isScrollControlled: true,
    );
  }
}
