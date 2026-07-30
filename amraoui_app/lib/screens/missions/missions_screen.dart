import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:Vehiqqo/service/repository/mission_repository.dart';
import 'package:Vehiqqo/widgets/cards/location_timeline_widget.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import 'mission_details_screen.dart';
import 'package:Vehiqqo/screens/missions/pickup_inspection_screen.dart'
    hide Gap;
import 'package:Vehiqqo/screens/missions/pickup_verification_screen.dart';
import 'package:Vehiqqo/screens/missions/delivery_inspection_screen.dart'
    hide Gap;
import 'package:Vehiqqo/screens/missions/multi_day_arrival_screen.dart';

class MissionsController extends GetxController {
  var activeMainTab = 0.obs; // 0: Open List, 1: My Missions
  var activeFilter = 'All'.obs;
  var myMissionsFilter = 'All'.obs; // All, Assigned, Active, Completed
  var searchQuery = ''.obs;

  var isLoading = true.obs;
  var isStartingMission = false.obs;
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
        for (var m in missions.value) {
          print(
            "MISSION DEBUG: id=${m['_id']}, myQuoteStatus=${m['myQuoteStatus']} (type: ${m['myQuoteStatus']?.runtimeType})",
          );
        }
      }
    } catch (e) {
      print("Error fetching missions: $e");
    } finally {
      isLoading(false);
    }
  }

  Future<bool> startMission(String id) async {
    try {
      isStartingMission.value = true;
      final res = await _repo.startMission(id);
      if (res.statusCode == 200) {
        await fetchMissions(); // Refresh
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      isStartingMission.value = false;
    }
  }

  Future<bool> cancelMission(String id, String reason, String note) async {
    try {
      final res = await _repo.cancelMission(id, reason, note);
      if (res.statusCode == 200) {
        await fetchMissions(); // Refresh
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  void setMainTab(int index) {
    activeMainTab.value = index;
    if (index == 1) {
      myMissionsFilter.value = 'All';
    } else {
      activeFilter.value = 'All';
    }
  }

  void setFilter(String filter) => activeFilter.value = filter;
  void setMyMissionsFilter(String filter) => myMissionsFilter.value = filter;
  void setSearchQuery(String query) => searchQuery.value = query;
}

class MissionsScreen extends StatefulWidget {
  const MissionsScreen({super.key});

  @override
  State<MissionsScreen> createState() => _MissionsScreenState();
}

class _MissionsScreenState extends State<MissionsScreen> {
  late final MissionsController controller;

  @override
  void initState() {
    super.initState();
    controller = Get.put(MissionsController());
  }

  @override
  Widget build(BuildContext context) {
    AppSize.size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () => controller.fetchMissions(),
                color: const Color(0xFF2563EB),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: EdgeInsets.symmetric(
                    horizontal: AppSize.width(value: 24),
                  ),
                  child: Column(
                    children: [
                      const Gap(height: 24),
                      _buildSearchBar(controller),
                      const Gap(height: 24),
                      _buildMainTabs(controller),
                      const Gap(height: 24),
                      Obx(
                        () => controller.activeMainTab.value == 0
                            ? _buildFilterChips(controller)
                            : _buildMyMissionsFilterTabs(controller),
                      ),
                      const Gap(height: 24),
                      _buildMissionsList(controller),
                      const Gap(height: 100),
                    ],
                  ),
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
          // Container(
          //   padding: const EdgeInsets.all(10),
          //   decoration: BoxDecoration(
          //     color: Colors.white,
          //     borderRadius: BorderRadius.circular(12),
          //     border: Border.all(color: const Color(0xFFE2E8F0)),
          //   ),
          //   child: const Icon(Icons.tune, color: Color(0xFF0F172A), size: 22),
          // ),
        ],
      ),
    );
  }

  Widget _buildSearchBar(MissionsController controller) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: TextField(
        onChanged: controller.setSearchQuery,
        decoration: const InputDecoration(
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
              title: 'Open List',
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
    final filters = ['All', 'Transport', 'Technical', 'Driver'];
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

  Widget _buildMyMissionsFilterTabs(MissionsController controller) {
    final filters = ['All', 'Assigned', 'Active', 'Completed'];
    return Obx(
      () => Row(
        children: filters.map((filter) {
          final isActive = controller.myMissionsFilter.value == filter;
          Color activeColor;
          if (filter == 'Assigned') {
            activeColor = const Color(0xFFD97706); // amber
          } else if (filter == 'Active') {
            activeColor = const Color(0xFF2563EB); // blue
          } else {
            activeColor = const Color(0xFF10B981); // green
          }
          return Expanded(
            child: GestureDetector(
              onTap: () => controller.setMyMissionsFilter(filter),
              child: Container(
                margin: EdgeInsets.only(right: filter != 'Completed' ? 8 : 0),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: isActive ? activeColor : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isActive ? activeColor : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Center(
                  child: AppText(
                    data: filter,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: isActive ? Colors.white : const Color(0xFF64748B),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildMissionsList(MissionsController controller) {
    return Obx(() {
      if (controller.isLoading.value) {
        return const Center(child: CircularProgressIndicator());
      }

      final isMyMissions = controller.activeMainTab.value == 1;
      final myFilter = controller.myMissionsFilter.value;

      // My Missions filter logic
      final filteredMissions = controller.missions.where((m) {
        if (isMyMissions) {
          final mStatus = (m['status'] ?? '').toString();
          if (myFilter == 'All') {
            return mStatus == 'ASSIGNED' ||
                mStatus == 'IN_PROGRESS' ||
                mStatus == 'COMPLETED';
          } else if (myFilter == 'Assigned') {
            return mStatus == 'ASSIGNED';
          } else if (myFilter == 'Active') {
            return mStatus == 'IN_PROGRESS';
          } else if (myFilter == 'Completed') {
            return mStatus == 'COMPLETED';
          }
          return false;
        } else {
          // Open List: Show missions open for bidding
          final mStatus = (m['status'] ?? '').toString();
          if (mStatus != 'OPEN_FOR_DRIVERS' &&
              mStatus != 'ADMIN_REVIEWING_DRIVERS') {
            return false;
          }

          // Apply type filter chips
          final filter = controller.activeFilter.value;
          if (filter != 'All') {
            if (filter == 'Transport' && m['type'] != 'TRANSPORT') return false;
            if (filter == 'Technical' && m['type'] != 'INSPECTION')
              return false;
            if (filter == 'Driver' && m['type'] != 'HIRE_DRIVER') return false;
          }
        }

        // Apply search query
        final query = controller.searchQuery.value.trim().toLowerCase();
        if (query.isNotEmpty) {
          final id =
              '#REQ-${(m['_id'] as String).substring((m['_id'] as String).length - 5).toLowerCase()}';
          final type = m['type'];
          final detailsObj = m['details'] ?? {};
          bool matches = id.contains(query);
          if (!matches) {
            if (type == 'TRANSPORT') {
              final city1 = (detailsObj['pickupCity'] ?? '')
                  .toString()
                  .toLowerCase();
              final city2 = (detailsObj['dropoffCity'] ?? '')
                  .toString()
                  .toLowerCase();
              final make = (detailsObj['make'] ?? '').toString().toLowerCase();
              final model = (detailsObj['model'] ?? '')
                  .toString()
                  .toLowerCase();
              matches =
                  city1.contains(query) ||
                  city2.contains(query) ||
                  make.contains(query) ||
                  model.contains(query);
            } else if (type == 'HIRE_DRIVER') {
              final city = (detailsObj['driverCity'] ?? '')
                  .toString()
                  .toLowerCase();
              matches = city.contains(query);
            } else if (type == 'INSPECTION') {
              final loc = (detailsObj['inspectionLocation'] ?? '')
                  .toString()
                  .toLowerCase();
              final make = (detailsObj['vehicleBrand'] ?? '')
                  .toString()
                  .toLowerCase();
              final model = (detailsObj['vehicleModel'] ?? '')
                  .toString()
                  .toLowerCase();
              matches =
                  loc.contains(query) ||
                  make.contains(query) ||
                  model.contains(query);
            }
          }
          if (!matches) return false;
        }
        return true;
      }).toList();

      if (filteredMissions.isEmpty) {
        return Padding(
          padding: const EdgeInsets.only(top: 60),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isMyMissions
                      ? (myFilter == 'All'
                            ? Icons.list_alt
                            : myFilter == 'Assigned'
                            ? Icons.hourglass_top_outlined
                            : myFilter == 'Active'
                            ? Icons.directions_car_outlined
                            : Icons.check_circle_outline)
                      : Icons.search_off,
                  size: 36,
                  color: const Color(0xFF94A3B8),
                ),
              ),
              const Gap(height: 16),
              AppText(
                data: isMyMissions
                    ? (myFilter == 'All'
                          ? 'No missions found'
                          : 'No $myFilter missions')
                    : 'No open missions found',
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: const Color(0xFF334155),
              ),
              const Gap(height: 6),
              AppText(
                data: isMyMissions
                    ? (myFilter == 'All'
                          ? 'Your active and assigned missions will appear here.'
                          : myFilter == 'Assigned'
                          ? 'Missions assigned to you will appear here.'
                          : myFilter == 'Active'
                          ? 'Missions you have started will appear here.'
                          : 'Your completed missions will appear here.')
                    : 'Check back later for new available missions.',
                fontSize: 13,
                color: const Color(0xFF94A3B8),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      }

      return Column(
        children: filteredMissions.map((m) {
          final realId = m['_id'];
          final id =
              m['missionId'] ??
              '#REQ-${(realId as String).substring((realId as String).length - 5).toUpperCase()}';
          final type = m['type'];
          final detailsObj = m['details'] ?? {};
          String title = 'Mission';
          if (type == 'TRANSPORT')
            title = 'Vehicle Transport';
          else if (type == 'INSPECTION')
            title = 'Vehicle Inspection';
          else if (type == 'HIRE_DRIVER')
            title = 'Hire Driver';

          String subtitle = 'No location specified';
          if (type == 'TRANSPORT') {
            final pCity = detailsObj['pickupCity']?.toString().trim() ?? '';
            final pAddr = detailsObj['pickupAddress']?.toString().trim() ?? '';
            final p = (pCity.isNotEmpty && pCity != 'null')
                ? pCity
                : ((pAddr.isNotEmpty && pAddr != 'null') ? pAddr : '');

            final dCity = detailsObj['dropoffCity']?.toString().trim() ?? '';
            final dAddr = detailsObj['dropoffAddress']?.toString().trim() ?? '';
            final d = (dCity.isNotEmpty && dCity != 'null')
                ? dCity
                : ((dAddr.isNotEmpty && dAddr != 'null') ? dAddr : '');

            if (p.isNotEmpty && d.isNotEmpty) {
              subtitle = '$p → $d';
            } else if (p.isNotEmpty) {
              subtitle = 'Pickup: $p';
            } else if (d.isNotEmpty) {
              subtitle = 'Dropoff: $d';
            } else {
              subtitle = 'Transport Request';
            }
          } else if (type == 'HIRE_DRIVER') {
            final c = detailsObj['driverCity']?.toString().trim() ?? '';
            final l = detailsObj['driverLocation']?.toString().trim() ?? '';
            final loc = (c.isNotEmpty && c != 'null')
                ? c
                : ((l.isNotEmpty && l != 'null') ? l : '');
            if (loc.isNotEmpty)
              subtitle = loc;
            else
              subtitle = 'Driver Request';
          } else if (type == 'INSPECTION') {
            final pCity = detailsObj['inspectionCity']?.toString().trim() ?? '';
            final pAddr = detailsObj['inspectionLocation']?.toString().trim() ?? '';
            final p = (pCity.isNotEmpty && pCity != 'null')
                ? pCity
                : ((pAddr.isNotEmpty && pAddr != 'null') ? pAddr : '');

            final dCity = detailsObj['destinationCity']?.toString().trim() ?? '';
            final dAddr = detailsObj['destinationAddress']?.toString().trim() ?? '';
            final d = (dCity.isNotEmpty && dCity != 'null')
                ? dCity
                : ((dAddr.isNotEmpty && dAddr != 'null') ? dAddr : '');

            if (p.isNotEmpty && d.isNotEmpty) {
              subtitle = '$p → $d';
            } else if (p.isNotEmpty) {
              subtitle = p;
            } else if (d.isNotEmpty) {
              subtitle = 'Dropoff: $d';
            } else {
              subtitle = 'Inspection Request';
            }
          }

          String price = 'Pending';
          double baseAmount = 0.0;

          if (isMyMissions && m['myQuoteAmount'] != null) {
            baseAmount =
                double.tryParse(m['myQuoteAmount']?.toString() ?? '0') ?? 0.0;
          } else {
            var aq = m['adminQuote'];
            if (aq != null) {
              var driverPriceStr = aq['driverPrice']?.toString();

              if (driverPriceStr != null &&
                  driverPriceStr.isNotEmpty &&
                  driverPriceStr != 'null') {
                baseAmount = double.tryParse(driverPriceStr) ?? 0.0;
              }
            }
          }

          double totalExpenses = 0.0;
          if (isMyMissions && m['expenses'] != null && m['expenses'] is List) {
            for (var exp in m['expenses']) {
              totalExpenses +=
                  double.tryParse(exp['amount']?.toString() ?? '0') ?? 0.0;
            }
          }

          final finalTotal = baseAmount + totalExpenses;

          if (finalTotal > 0) {
            price = '€${finalTotal.toStringAsFixed(2)}';
          }

          // Status badge
          String displayStatus;
          Color statusBgColor;
          Color statusTextColor;

          if (isMyMissions) {
            final mStat = (m['status'] ?? '').toString();
            if (mStat == 'ASSIGNED') {
              displayStatus = 'Assigned';
              statusBgColor = const Color(0xFFF0FDF4);
              statusTextColor = const Color(0xFF22C55E);
            } else if (mStat == 'IN_PROGRESS') {
              displayStatus = 'In Progress';
              statusBgColor = const Color(0xFFEFF6FF);
              statusTextColor = const Color(0xFF2563EB);
            } else if (mStat == 'COMPLETED') {
              displayStatus = 'Completed';
              statusBgColor = const Color(0xFFF1F5F9);
              statusTextColor = const Color(0xFF64748B);
            } else {
              displayStatus = mStat;
              statusBgColor = const Color(0xFFF1F5F9);
              statusTextColor = const Color(0xFF64748B);
            }
          } else {
            displayStatus = 'Open';
            statusBgColor = const Color(0xFFEFF6FF);
            statusTextColor = const Color(0xFF2563EB);

            if (m['myQuoteStatus'] == 'PENDING') {
              displayStatus = 'Pending';
              statusBgColor = const Color(0xFFFEF9C3);
              statusTextColor = const Color(0xFFCA8A04);
            } else if (m['myQuoteStatus'] == 'REJECTED') {
              displayStatus = 'Rejected';
              statusBgColor = const Color(0xFFFEE2E2);
              statusTextColor = const Color(0xFFDC2626);
            }
          }

          String detailsText = '';
          if (type == 'TRANSPORT') {
            final mk = (detailsObj['make'] ?? '').toString().trim();
            final md = (detailsObj['model'] ?? '').toString().trim();
            final vehicle = [
              mk,
              md,
            ].where((p) => p.isNotEmpty && p != 'null').join(' ');

            final vt = _formatEnum(
              (detailsObj['vehicleType'] ?? '').toString(),
            );
            final cond = _formatEnum(
              (detailsObj['condition'] ?? '').toString(),
            );

            final parts = [
              vehicle,
              vt,
              cond,
            ].where((p) => p.isNotEmpty && p != 'null').toList();
            detailsText = parts.take(3).join(' • ');
          } else if (type == 'INSPECTION') {
            final vb = (detailsObj['vehicleBrand'] ?? '').toString().trim();
            final vm = (detailsObj['vehicleModel'] ?? '').toString().trim();
            final vehicle = [
              vb,
              vm,
            ].where((p) => p.isNotEmpty && p != 'null').join(' ');

            final it = _formatEnum(
              (detailsObj['inspectionType'] ?? '').toString(),
            );

            final vin = (detailsObj['vinNumber'] ?? '').toString().trim();
            final vinStr = (vin.isNotEmpty && vin != 'null') ? 'VIN: $vin' : '';

            final plate = (detailsObj['licensePlate'] ?? '').toString().trim();
            final plateStr = (plate.isNotEmpty && plate != 'null')
                ? 'Plate: $plate'
                : '';

            final thirdItem = vinStr.isNotEmpty ? vinStr : plateStr;

            final parts = [
              vehicle,
              it,
              thirdItem,
            ].where((p) => p.isNotEmpty && p != 'null').toList();
            detailsText = parts.take(3).join(' • ');
          } else if (type == 'HIRE_DRIVER') {
            final count = (detailsObj['driverCount'] ?? '').toString().trim();
            final cStr = (count.isNotEmpty && count != 'null')
                ? '$count Driver(s)'
                : '';

            final sd = (detailsObj['driverStartDate'] ?? '').toString().trim();
            final st = (detailsObj['driverStartTime'] ?? '').toString().trim();
            final start = [
              sd,
              st,
            ].where((p) => p.isNotEmpty && p != 'null').join(' ');
            final startStr = start.isNotEmpty ? 'Start: $start' : '';

            final ed = (detailsObj['driverEndDate'] ?? '').toString().trim();
            final et = (detailsObj['driverEndTime'] ?? '').toString().trim();
            final end = [
              ed,
              et,
            ].where((p) => p.isNotEmpty && p != 'null').join(' ');
            final endStr = end.isNotEmpty ? 'End: $end' : '';

            final parts = [
              cStr,
              startStr,
              endStr,
            ].where((p) => p.isNotEmpty).toList();
            detailsText = parts.take(3).join(' • ');
          }

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildMissionCard(
              mission: m,
              title: title,
              id: id,
              price: price,
              subtitle: subtitle,
              details: detailsText,
              status: displayStatus,
              statusBg: statusBgColor,
              statusText: statusTextColor,
              isMyMissions: isMyMissions,
            ),
          );
        }).toList(),
      );
    });
  }

  String _formatEnum(String? text) {
    if (text == null || text.trim().isEmpty || text == 'null') return '';
    final words = text.replaceAll('_', ' ').replaceAll('-', ' ').split(' ');
    return words
        .map((w) {
          if (w.isEmpty) return '';
          if (w.toLowerCase() == 'isnpection')
            return 'Inspection'; // Fix DB typo
          return w[0].toUpperCase() + w.substring(1).toLowerCase();
        })
        .join(' ');
  }

  Widget _buildCardInfoChip(IconData icon, String label, String? value) {
    final v = (value ?? '').trim();
    if (v.isEmpty || v == 'null' || v == 'N/A') return const SizedBox.shrink();
    return Container(
      margin: const EdgeInsets.only(right: 8, top: 8),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF64748B)),
          const Gap(width: 4),
          AppText(
            data: '$label$v',
            fontSize: 12,
            color: const Color(0xFF64748B),
            fontWeight: FontWeight.w500,
          ),
        ],
      ),
    );
  }

  Widget _buildMissionCard({
    required Map<String, dynamic> mission,
    required String title,
    required String id,
    required String price,
    required String subtitle,
    required String details,
    required String status,
    required Color statusBg,
    required Color statusText,
    required bool isMyMissions,
  }) {
    return GestureDetector(
      onTap: () {
        final qStatus = mission['myQuoteStatus']?.toString().toUpperCase();
        final hasQuote =
            qStatus == 'PENDING' ||
            qStatus == 'ACCEPTED' ||
            qStatus == 'REJECTED';
        print(
          "TAP DEBUG: id=${mission['_id']}, myQuoteStatus=${mission['myQuoteStatus']}, myQuoteAmount=${mission['myQuoteAmount']}, myQuoteMessage=${mission['myQuoteMessage']}, myQuoteTime=${mission['myQuoteTime']}",
        );

        if (isMyMissions) {
          // Show full details for assigned/active/completed missions in My Missions tab
          _showMissionDetails(mission, id);
        } else if (!isMyMissions && !hasQuote) {
          // Open List: no quote yet — go straight to quote dialog
          _showQuoteDialog(mission, id);
        } else if (hasQuote) {
          // Already submitted a quote — offer to update
          Get.dialog(
            Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              backgroundColor: Colors.white,
              elevation: 0,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: const BoxDecoration(
                        color: Color(0xFFEFF6FF),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.info_outline,
                        color: Color(0xFF2563EB),
                        size: 32,
                      ),
                    ),
                    const Gap(height: 20),
                    const AppText(
                      data: 'Already Submitted',
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                    const Gap(height: 12),
                    const AppText(
                      data:
                          'You have already submitted a quote for this mission. Do you want to update it?',
                      fontSize: 14,
                      color: Color(0xFF64748B),
                      textAlign: TextAlign.center,
                    ),
                    const Gap(height: 24),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              side: const BorderSide(color: Color(0xFFE2E8F0)),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            onPressed: () {
                              if (Get.overlayContext != null) {
                                Navigator.of(Get.overlayContext!).pop();
                              } else {
                                Get.back();
                              }
                            },
                            child: const AppText(
                              data: 'Cancel',
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const Gap(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2563EB),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 0,
                            ),
                            onPressed: () {
                              Get.back(); // Closes the 'Already Submitted' dialog immediately
                              Future.delayed(
                                const Duration(milliseconds: 100),
                                () => _showQuoteDialog(mission, id),
                              );
                            },
                            child: const AppText(
                              data: 'Update',
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        } else {
          _showQuoteDialog(mission, id);
        }
      },
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
                AppText(data: title, fontSize: 18, fontWeight: FontWeight.w800),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B), // Orange pill
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.bolt, color: Colors.white, size: 16),
                          const Gap(width: 4),
                          AppText(
                            data: price,
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                AppText(data: id, fontSize: 13, color: const Color(0xFF94A3B8)),
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
            LocationTimelineWidget(mission: mission),
            const Gap(height: 16),
            const Divider(color: Color(0xFFF1F5F9)),
            const Gap(height: 12),
            AppText(
              data: details,
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF334155),
            ),
            Builder(
              builder: (context) {
                String _formatCardDate(String? dateStr) {
                  if (dateStr == null || dateStr.trim().isEmpty) return '';
                  try {
                    final parts = dateStr.split('-');
                    if (parts.length == 3 && parts[0].length == 4) {
                      return '${parts[2]}/${parts[1]}/${parts[0]}';
                    }
                  } catch (_) {}
                  return dateStr;
                }

                if (mission['type'] == 'TRANSPORT') {
                  return Wrap(
                    children: [
                      _buildCardInfoChip(
                        Icons.calendar_today,
                        'Pickup: ',
                        _formatCardDate(
                          mission['details']?['pickupDate']?.toString(),
                        ),
                      ),
                      _buildCardInfoChip(
                        Icons.event_available,
                        'Dropoff: ',
                        _formatCardDate(
                          mission['details']?['dropoffDate']?.toString(),
                        ),
                      ),
                      _buildCardInfoChip(
                        Icons.monitor_weight_outlined,
                        'Weight: ',
                        mission['details']?['vehicleWeight']?.toString(),
                      ),
                    ],
                  );
                } else if (mission['type'] == 'INSPECTION') {
                  return Wrap(
                    children: [
                      _buildCardInfoChip(
                        Icons.calendar_today,
                        '',
                        '${_formatCardDate(mission['details']?['inspectionDate']?.toString())} ${mission['details']?['inspectionTime'] ?? ''}'
                            .trim(),
                      ),
                    ],
                  );
                } else if (mission['type'] == 'HIRE_DRIVER') {
                  final tasksList = mission['details']?['driverTasks'];
                  final tasks = tasksList is List ? tasksList.join(', ') : '';
                  final reqList = mission['details']?['driverRequirements'];
                  final reqs = reqList is List ? reqList.join(', ') : '';
                  return Wrap(
                    children: [
                      _buildCardInfoChip(Icons.task_alt, 'Tasks: ', tasks),
                      _buildCardInfoChip(
                        Icons.verified_user_outlined,
                        'Reqs: ',
                        reqs,
                      ),
                    ],
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String? value) {
    final v = (value ?? '').trim();
    if (v.isEmpty || v == 'null' || v == 'N/A' || v == ',' || v == '()')
      return const SizedBox.shrink();

    String displayValue = v;
    if (displayValue.startsWith(','))
      displayValue = displayValue.substring(1).trim();
    if (displayValue.endsWith(','))
      displayValue = displayValue.substring(0, displayValue.length - 1).trim();
    if (displayValue.isEmpty || displayValue == 'null')
      return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: AppText(
              data: label,
              color: const Color(0xFF64748B),
              fontSize: 13,
            ),
          ),
          Expanded(
            flex: 3,
            child: AppText(
              data: displayValue,
              color: const Color(0xFF0F172A),
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMissionInfoBlock(Map<String, dynamic> m) {
    String _formatDateString(String? dateStr) {
      if (dateStr == null || dateStr.trim().isEmpty || dateStr == 'null')
        return '';
      try {
        final parts = dateStr.split('-');
        if (parts.length == 3 && parts[0].length == 4) {
          return '${parts[2]}/${parts[1]}/${parts[0]}';
        }
      } catch (_) {}
      return dateStr;
    }

    String _formatDeliveryType(String? delType) {
      if (delType == null || delType.trim().isEmpty || delType.trim().toLowerCase() == 'null') return '';
      final lower = delType.trim().toLowerCase();
      if (lower == 'license' || lower.contains('dealer') || lower.contains('z or v')) {
        return 'Use of dealer plates (Z or V green plates)';
      } else if (lower == 'tow' || lower.contains('carrier')) {
        return 'Vehicle Carrier (Tow Truck)';
      } else if (lower == 'drive') {
        return 'Drive with car';
      }
      return delType;
    }

    final type = m['type'];
    final d = m['details'] ?? {};
    if (type == 'TRANSPORT') {
      final yearStr =
          (d['year'] != null &&
              d['year'].toString().trim().isNotEmpty &&
              d['year'].toString() != 'null')
          ? '(${d['year']})'
          : '';
      final delTypeStr = _formatDeliveryType(d['deliveryType']?.toString());
      final isDealerPlates = d['deliveryType']?.toString().toLowerCase() == 'license' ||
          d['deliveryType']?.toString().toLowerCase().contains('dealer') == true ||
          d['deliveryType']?.toString().toLowerCase().contains('z or v') == true;

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoRow('Type', 'Vehicle Transport'),
          _buildInfoRow(
            'Vehicle',
            '${d['make'] ?? ''} ${d['model'] ?? ''} ${_formatEnum(d['vehicleType']?.toString())} $yearStr',
          ),
          if (delTypeStr.isNotEmpty)
            _buildInfoRow('Delivery Type', delTypeStr),
          if (isDealerPlates) ...[
            Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFF59E0B)),
              ),
              child: Row(
                children: const [
                  Icon(Icons.warning_amber_rounded, color: Color(0xFFD97706), size: 16),
                  Gap(width: 6),
                  Expanded(
                    child: AppText(
                      data: 'Dealer plates required for this mission (Z or V green plates)',
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF92400E),
                    ),
                  ),
                ],
              ),
            ),
          ],
          _buildInfoRow('Weight', d['vehicleWeight']?.toString()),
          _buildInfoRow('Condition', d['condition']?.toString()),
          _buildInfoRow(
            'Pickup',
            '${d['pickupAddress'] ?? ''}, ${d['pickupCity'] ?? ''}',
          ),
          _buildInfoRow(
            'Dropoff',
            '${d['dropoffAddress'] ?? ''}, ${d['dropoffCity'] ?? ''}',
          ),
          _buildInfoRow(
            'Pickup Date',
            '${_formatDateString(d['pickupDate']?.toString())} ${d['pickupTime'] != null && d['pickupTime'].toString().trim().isNotEmpty && d['pickupTime'].toString() != 'null' ? d['pickupTime'] : ''}'.trim(),
          ),
          _buildInfoRow(
            'Dropoff Date',
            '${_formatDateString(d['dropoffDate']?.toString())} ${d['dropoffTime'] != null && d['dropoffTime'].toString().trim().isNotEmpty && d['dropoffTime'].toString() != 'null' ? d['dropoffTime'] : ''}'.trim(),
          ),
          _buildInfoRow('Special Info', d['specialInstructions']?.toString()),
        ],
      );
    } else if (type == 'INSPECTION') {
      return Column(
        children: [
          _buildInfoRow('Type', 'Technical Inspection'),
          _buildInfoRow(
            'Inspection',
            _formatEnum(d['inspectionType']?.toString()),
          ),
          _buildInfoRow(
            'Vehicle',
            '${d['vehicleBrand'] ?? ''} ${d['vehicleModel'] ?? ''}',
          ),
          _buildInfoRow('License Plate', d['licensePlate']?.toString()),
          _buildInfoRow('VIN Number', d['vinNumber']?.toString()),
          _buildInfoRow('Location', d['inspectionLocation']?.toString()),
          _buildInfoRow(
            'Date & Time',
            '${_formatDateString(d['inspectionDate']?.toString())} ${d['inspectionTime'] != null && d['inspectionTime'].toString() != 'null' && d['inspectionTime'].toString().isNotEmpty ? 'at ${d['inspectionTime']}' : ''}'
                .trim(),
          ),
          if (d['destinationAddress']?.toString().isNotEmpty == true ||
              d['destinationCity']?.toString().isNotEmpty == true) ...[
            _buildInfoRow(
              'Dropoff Location',
              '${d['destinationAddress'] ?? ''} ${d['destinationCity'] ?? ''}'.trim(),
            ),
            _buildInfoRow(
              'Dropoff Date & Time',
              '${_formatDateString(d['destinationDate']?.toString())} ${d['destinationTime'] != null && d['destinationTime'].toString() != 'null' && d['destinationTime'].toString().isNotEmpty ? 'at ${d['destinationTime']}' : ''}'
                  .trim(),
            ),
            if (d['destinationContactName']?.toString().isNotEmpty == true)
              _buildInfoRow('Dropoff Contact', d['destinationContactName']?.toString()),
          ],
          _buildInfoRow('Notes', d['inspectionNotes']?.toString()),
        ],
      );
    } else if (type == 'HIRE_DRIVER') {
      return Column(
        children: [
          _buildInfoRow('Type', 'Hire Driver'),
          _buildInfoRow('Drivers needed', d['driverCount']?.toString()),
          _buildInfoRow('Location', d['driverLocation']?.toString()),
          _buildInfoRow(
            'Start',
            '${_formatDateString(d['driverStartDate']?.toString())} ${d['driverStartTime'] ?? ''}'
                .trim(),
          ),
          _buildInfoRow(
            'End',
            '${_formatDateString(d['driverEndDate']?.toString())} ${d['driverEndTime'] ?? ''}'
                .trim(),
          ),
          _buildInfoRow('Notes', d['driverTaskNotes']?.toString()),
        ],
      );
    }
    return const SizedBox.shrink();
  }

  InputDecoration _modernInputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(
        fontSize: 14,
        color: Color(0xFF64748B),
        fontWeight: FontWeight.w500,
      ),
      filled: true,
      fillColor: const Color(
        0xFFF1F5F9,
      ), // Darker slate for modern contrast without border
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFF2563EB), width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      isDense: true,
    );
  }

  void _showQuoteDialog(Map<String, dynamic> mission, String displayId) {
    final fuelCtrl = TextEditingController(
      text: mission['myQuoteFuelCost']?.toString() ?? '0',
    );
    final tollCtrl = TextEditingController(
      text: mission['myQuoteTollCharges']?.toString() ?? '0',
    );
    final travelCtrl = TextEditingController(
      text: mission['myQuoteTravelCost']?.toString() ?? '0',
    );
    final taxiCtrl = TextEditingController(
      text: mission['myQuoteTaxiCost']?.toString() ?? '0',
    );
    final servicePriceCtrl = TextEditingController(
      text: mission['myQuoteServicePrice']?.toString() ?? '0',
    );
    final notesCtrl = TextEditingController(
      text: mission['myQuoteMessage']?.toString() ?? '',
    );

    String _sanitize(String? val) {
      if (val == null) return '';
      if (val.contains('\$')) return '';
      return val;
    }

    DateTime _stripTime(DateTime dt) {
      return DateTime(dt.year, dt.month, dt.day);
    }

    DateTime? _parseCustomerDate(String? dateStr) {
      if (dateStr == null || dateStr.trim().isEmpty) return null;
      dateStr = dateStr.trim();
      try {
        return _stripTime(DateTime.parse(dateStr));
      } catch (_) {}

      try {
        final parts = dateStr.split(RegExp(r'[/.-]'));
        if (parts.length == 3) {
          if (parts[0].length <= 2 && parts[2].length == 4) {
            return DateTime(
              int.parse(parts[2]),
              int.parse(parts[1]),
              int.parse(parts[0]),
            );
          }
          if (parts[0].length == 4 && parts[2].length <= 2) {
            return DateTime(
              int.parse(parts[0]),
              int.parse(parts[1]),
              int.parse(parts[2]),
            );
          }
        }
      } catch (_) {}
      return null;
    }

    String _formatDisplayDate(String? dateStr) {
      if (dateStr == null || dateStr.trim().isEmpty) return '';
      final parsed = _parseCustomerDate(dateStr);
      if (parsed != null) {
        return "${parsed.day.toString().padLeft(2, '0')}/${parsed.month.toString().padLeft(2, '0')}/${parsed.year}";
      }
      return dateStr;
    }

    final RxString pickupDate = _formatDisplayDate(
      _sanitize(mission['myQuotePickupDate']?.toString()),
    ).obs;
    final RxString pickupTime = _sanitize(
      mission['myQuotePickupTime']?.toString(),
    ).obs;
    final RxString dropoffDate = _formatDisplayDate(
      _sanitize(mission['myQuoteDropoffDate']?.toString()),
    ).obs;
    final RxString dropoffTime = _sanitize(
      mission['myQuoteDropoffTime']?.toString(),
    ).obs;

    final qStatus = mission['myQuoteStatus']?.toString().toUpperCase();
    final isUpdate =
        qStatus == 'PENDING' || qStatus == 'ACCEPTED' || qStatus == 'REJECTED';
    final isLoading = false.obs;

    final totalAmount =
        (double.tryParse(mission['myQuoteAmount']?.toString() ?? '0') ?? 0.0)
            .obs;

    void calculateTotal() {
      double s = double.tryParse(servicePriceCtrl.text) ?? 0;
      double f = double.tryParse(fuelCtrl.text) ?? 0;
      double to = double.tryParse(tollCtrl.text) ?? 0;
      double tr = double.tryParse(travelCtrl.text) ?? 0;
      double ta = double.tryParse(taxiCtrl.text) ?? 0;
      totalAmount.value = s + f + to + tr + ta;
    }

    servicePriceCtrl.addListener(calculateTotal);
    fuelCtrl.addListener(calculateTotal);
    tollCtrl.addListener(calculateTotal);
    travelCtrl.addListener(calculateTotal);
    taxiCtrl.addListener(calculateTotal);

    // Calculate initial total
    calculateTotal();
    // If legacy quote with amount but no detailed costs
    if (isUpdate &&
        totalAmount.value == 0 &&
        mission['myQuoteAmount'] != null) {
      totalAmount.value =
          double.tryParse(mission['myQuoteAmount'].toString()) ?? 0.0;
    }

    Widget buildDatePicker(
      String label,
      RxString dateObs,
      String? customerDateStr,
    ) {
      return GestureDetector(
        onTap: () async {
          final String dateStrToParse = dateObs.value.isNotEmpty ? dateObs.value : (customerDateStr ?? '');
          final customerDate =
              _parseCustomerDate(dateStrToParse) ?? _stripTime(DateTime.now());

          final firstAllowedDate = DateTime.now().subtract(const Duration(days: 365 * 5));
          final lastAllowedDate = DateTime.now().add(const Duration(days: 365 * 10));
          
          final actualFirstDate = customerDate.isBefore(firstAllowedDate) 
              ? customerDate.subtract(const Duration(days: 365)) 
              : firstAllowedDate;
          final actualLastDate = customerDate.isAfter(lastAllowedDate) 
              ? customerDate.add(const Duration(days: 365)) 
              : lastAllowedDate;

          final picked = await showDatePicker(
            context: Get.context!,
            initialDate: customerDate,
            firstDate: actualFirstDate,
            lastDate: actualLastDate,
            builder: (context, child) {
              return Theme(
                data: ThemeData.light().copyWith(
                  primaryColor: const Color(0xFF2563EB),
                  colorScheme: const ColorScheme.light(
                    primary: Color(0xFF2563EB),
                  ),
                ),
                child: child!,
              );
            },
          );
          if (picked != null) {
            dateObs.value =
                "${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}";
          }
        },
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Obx(
            () => AppText(
              data: dateObs.value.isEmpty ? label : dateObs.value,
              color: dateObs.value.isEmpty
                  ? const Color(0xFF64748B)
                  : const Color(0xFF0F172A),
              fontSize: 14,
            ),
          ),
        ),
      );
    }

    Widget buildTimePicker(String label, RxString timeObs) {
      return GestureDetector(
        onTap: () async {
          final picked = await showTimePicker(
            context: Get.context!,
            initialTime: TimeOfDay.now(),
            builder: (context, child) {
              return MediaQuery(
                data: MediaQuery.of(
                  context,
                ).copyWith(alwaysUse24HourFormat: true),
                child: child!,
              );
            },
          );
          if (picked != null) {
            timeObs.value =
                "${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}";
          }
        },
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Obx(
            () => AppText(
              data: timeObs.value.isEmpty ? label : timeObs.value,
              color: timeObs.value.isEmpty
                  ? const Color(0xFF64748B)
                  : const Color(0xFF0F172A),
              fontSize: 14,
            ),
          ),
        ),
      );
    }

    Get.bottomSheet(
      Builder(
        builder: (context) {
          // Get the keyboard height
          final mediaQuery = MediaQuery.of(context);
          final keyboardHeight = mediaQuery.viewInsets.bottom;
          final bottomPadding = mediaQuery.padding.bottom;

          return Container(
            padding: EdgeInsets.only(
              left: 24,
              right: 24,
              top: 24,
              bottom: 24 + bottomPadding,
            ),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: SingleChildScrollView(
              // Add padding for keyboard
              padding: EdgeInsets.only(
                bottom: keyboardHeight > 0 ? keyboardHeight : 0,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const AppText(
                              data: 'Mission Details',
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                            AppText(
                              data: displayId,
                              fontSize: 14,
                              color: const Color(0xFF64748B),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ),
                  const Gap(height: 16),
                  _buildMissionInfoBlock(mission),
                  const Gap(height: 24),
                  const Divider(color: Color(0xFFF1F5F9)),
                  const Gap(height: 16),
                  AppText(
                    data: isUpdate ? 'Update Your Quote' : 'Submit Your Quote',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  const Gap(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: fuelCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 14),
                          decoration: _modernInputDecoration('Fuel cost (€)'),
                        ),
                      ),
                      const Gap(width: 10),
                      Expanded(
                        child: TextField(
                          controller: tollCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 14),
                          decoration: _modernInputDecoration(
                            'Toll charges (€)',
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Gap(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: travelCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 14),
                          decoration: _modernInputDecoration('Travel cost (€)'),
                        ),
                      ),
                      const Gap(width: 10),
                      Expanded(
                        child: TextField(
                          controller: taxiCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 14),
                          decoration: _modernInputDecoration('Taxi cost (€)'),
                        ),
                      ),
                    ],
                  ),
                  const Gap(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: servicePriceCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 14),
                          decoration: _modernInputDecoration(
                            'Service Price (€)',
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Gap(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: buildDatePicker(
                          'Pickup Date',
                          pickupDate,
                          mission['details']?['pickupDate']?.toString(),
                        ),
                      ),
                      const Gap(width: 10),
                      Expanded(
                        child: buildTimePicker('Pickup Time', pickupTime),
                      ),
                    ],
                  ),
                  const Gap(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: buildDatePicker(
                          'Dropoff Date',
                          dropoffDate,
                          mission['details']?['dropoffDate']?.toString(),
                        ),
                      ),
                      const Gap(width: 10),
                      Expanded(
                        child: buildTimePicker('Dropoff Time', dropoffTime),
                      ),
                    ],
                  ),
                  const Gap(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 14,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const AppText(
                          data: 'Total Price',
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF334155),
                        ),
                        Obx(
                          () => AppText(
                            data: '€${totalAmount.value.toStringAsFixed(2)}',
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: const Color(0xFF2563EB),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Gap(height: 12),
                  TextField(
                    controller: notesCtrl,
                    style: const TextStyle(fontSize: 14),
                    decoration: _modernInputDecoration('Message / Notes'),
                    maxLines: 3,
                  ),
                  const Gap(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      onPressed: () async {
                        if (isLoading.value) return;

                        List<String> missingFields = [];
                        if (totalAmount.value == 0) {
                          missingFields.add(
                            'Costs/Service Price (Total cannot be €0.00)',
                          );
                        }

                        if (pickupDate.value.isEmpty)
                          missingFields.add('Pickup Date');
                        if (pickupTime.value.isEmpty)
                          missingFields.add('Pickup Time');
                        if (dropoffDate.value.isEmpty)
                          missingFields.add('Dropoff Date');
                        if (dropoffTime.value.isEmpty)
                          missingFields.add('Dropoff Time');

                        if (missingFields.isNotEmpty) {
                          Get.snackbar(
                            'Missing Fields',
                            'Please provide: ${missingFields.join(", ")}',
                            snackPosition: SnackPosition.bottom,
                            backgroundColor: const Color(0xFFEF4444),
                            colorText: Colors.white,
                            borderRadius: 12,
                            margin: const EdgeInsets.all(16),
                            icon: const Icon(
                              Icons.warning_amber_rounded,
                              color: Colors.white,
                            ),
                          );
                          return;
                        }

                        isLoading.value = true;
                        try {
                          final repo = MissionRepository();
                          final res = await repo.submitQuote(
                            mission['_id'],
                            totalAmount.value,
                            servicePrice:
                                double.tryParse(servicePriceCtrl.text) ?? 0,
                            fuelCost: double.tryParse(fuelCtrl.text) ?? 0,
                            tollCharges: double.tryParse(tollCtrl.text) ?? 0,
                            travelCost: double.tryParse(travelCtrl.text) ?? 0,
                            taxiCost: double.tryParse(taxiCtrl.text) ?? 0,
                            message: notesCtrl.text.isEmpty
                                ? null
                                : notesCtrl.text,
                            pickupDate: pickupDate.value.isEmpty
                                ? null
                                : pickupDate.value,
                            pickupTime: pickupTime.value.isEmpty
                                ? null
                                : pickupTime.value,
                            dropoffDate: dropoffDate.value.isEmpty
                                ? null
                                : dropoffDate.value,
                            dropoffTime: dropoffTime.value.isEmpty
                                ? null
                                : dropoffTime.value,
                          );
                          FocusManager.instance.primaryFocus?.unfocus();

                          bool isAutoAssigned = false;
                          if (res.data != null && res.data['data'] != null) {
                            final missionData = res.data['data'];
                            if (missionData['status'] == 'ASSIGNED') {
                              isAutoAssigned = true;
                            }
                          }

                          if (Navigator.canPop(context)) {
                            Navigator.pop(context);
                          } else {
                            Get.back();
                          }
                          Get.snackbar(
                            isAutoAssigned ? 'Instant Booking! 🚀' : 'Success',
                            isAutoAssigned
                                ? 'Your quote was accepted immediately. You have been assigned to this mission.'
                                : (isUpdate
                                      ? 'Quote updated successfully'
                                      : 'Quote submitted successfully'),
                            snackPosition: SnackPosition.bottom,
                            backgroundColor: const Color(0xFF10B981),
                            colorText: Colors.white,
                            borderRadius: 12,
                            margin: const EdgeInsets.all(16),
                            icon: const Icon(
                              Icons.check_circle,
                              color: Colors.white,
                            ),
                            duration: const Duration(seconds: 4),
                          );
                          Get.find<MissionsController>().fetchMissions();
                        } catch (e) {
                          Get.snackbar(
                            'Error',
                            'Failed to submit quote',
                            snackPosition: SnackPosition.bottom,
                            backgroundColor: const Color(0xFFEF4444),
                            colorText: Colors.white,
                            borderRadius: 12,
                            margin: const EdgeInsets.all(16),
                            icon: const Icon(
                              Icons.error_outline,
                              color: Colors.white,
                            ),
                          );
                        } finally {
                          isLoading.value = false;
                        }
                      },
                      child: Obx(
                        () => isLoading.value
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : AppText(
                                data: isUpdate
                                    ? 'Update Quote'
                                    : 'Submit Quote',
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                      ),
                    ),
                  ),
                  // Add some extra bottom space for the keyboard
                  const Gap(height: 20),
                ],
              ),
            ),
          );
        },
      ),
      isScrollControlled: true,
      // Add these to improve keyboard handling
      enableDrag: false,
      backgroundColor: Colors.transparent,
    );
  }

  void _showMissionDetails(Map<String, dynamic> mission, String reqId) {
    if (mission['status'] == 'IN_PROGRESS') {
      final type = mission['type'];
      final details = mission['details'] ?? {};
      final verification = details['pickupVerification'];
      final bool isVerified =
          verification != null && verification['arrivalDeclared'] == true;

      if (type == 'INSPECTION') {
        if (isVerified) {
          Get.to(
            () => DeliveryInspectionScreen(mission: mission, reqId: reqId),
          );
        } else {
          Get.to(
            () => PickupVerificationScreen(mission: mission, reqId: reqId),
          );
        }
      } else if (type == 'HIRE_DRIVER') {
        Get.to(() => MultiDayArrivalScreen(mission: mission, reqId: reqId));
      } else {
        // TRANSPORT
        if (isVerified && verification['vehicleMatchConfirmed'] == true) {
          Get.to(() => PickupInspectionScreen(mission: mission, reqId: reqId));
        } else {
          Get.to(
            () => PickupVerificationScreen(mission: mission, reqId: reqId),
          );
        }
      }
      return;
    }

    // For ASSIGNED or other statuses, show the standard details screen
    Get.to(() => MissionDetailsScreen(mission: mission, reqId: reqId));
  }
}
