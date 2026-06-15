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
  var searchQuery = ''.obs;

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
  void setSearchQuery(String query) => searchQuery.value = query;
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
                      _buildFilterChips(controller),
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

  Widget _buildMissionsList(MissionsController controller) {
    return Obx(() {
      if (controller.isLoading.value) {
        return const Center(child: CircularProgressIndicator());
      }

      final isMyMissions = controller.activeMainTab.value == 1;

      // Basic filter logic
      final filteredMissions = controller.missions.where((m) {
        final isAssigned = m['assignedDriverId'] != null;

        if (isMyMissions) {
          if (!isAssigned) return false;
        } else {
          // Open List: Show missions that are not yet fully assigned
          if (isAssigned) {
            // Only show if the quote was rejected
            if (m['myQuoteStatus'] != 'REJECTED') return false;
          }
        }

        // Apply string filters by type
        final filter = controller.activeFilter.value;
        if (filter != 'All') {
          if (filter == 'Transport' && m['type'] != 'TRANSPORT') return false;
          if (filter == 'Technical' && m['type'] != 'INSPECTION') return false;
          if (filter == 'Driver' && m['type'] != 'HIRE_DRIVER') return false;
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
          padding: const EdgeInsets.only(top: 40),
          child: AppText(
            data:
                'No missions found (Total fetched: ${controller.missions.length})',
            fontSize: 14,
            color: const Color(0xFF64748B),
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
            final l = detailsObj['inspectionLocation']?.toString().trim() ?? '';
            if (l.isNotEmpty && l != 'null')
              subtitle = l;
            else
              subtitle = 'Inspection Request';
          }

          final price = m['adminQuote'] != null
              ? '€${m['adminQuote']['amount']}'
              : 'Pending';

          String displayStatus = isMyMissions ? 'Assigned' : 'Open';
          Color statusBgColor = isMyMissions
              ? const Color(0xFFF0FDF4)
              : const Color(0xFFEFF6FF);
          Color statusTextColor = isMyMissions
              ? const Color(0xFF22C55E)
              : const Color(0xFF2563EB);

          if (!isMyMissions && m['myQuoteStatus'] == 'PENDING') {
            displayStatus = 'Pending';
            statusBgColor = const Color(0xFFFEF9C3); // yellow-100
            statusTextColor = const Color(0xFFCA8A04); // yellow-600
          } else if (!isMyMissions && m['myQuoteStatus'] == 'REJECTED') {
            displayStatus = 'Rejected';
            statusBgColor = const Color(0xFFFEE2E2); // red-100
            statusTextColor = const Color(0xFFDC2626); // red-600
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
  }) {
    return GestureDetector(
      onTap: () {
        if (mission['myQuoteStatus'] != null) {
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
                        color: Color(0xFFEFF6FF), // blue-50
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.info_outline,
                        color: Color(0xFF2563EB), // blue-600
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
                      data: 'You have already submitted a quote for this mission. Do you want to update it?',
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
                              if (Get.overlayContext != null) {
                                Navigator.of(Get.overlayContext!).pop();
                              } else {
                                Get.back();
                              }
                              Future.delayed(const Duration(milliseconds: 100), () {
                                _showQuoteDialog(mission, id);
                              });
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
                Expanded(
                  child: AppText(
                    data: subtitle,
                    fontSize: 13,
                    color: const Color(0xFF64748B),
                  ),
                ),
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
            AppText(
              data: details,
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF334155),
            ),
            if (mission['type'] == 'TRANSPORT')
              Wrap(
                children: [
                  _buildCardInfoChip(
                    Icons.calendar_today,
                    'Pickup: ',
                    mission['details']?['pickupDate']?.toString(),
                  ),
                  _buildCardInfoChip(
                    Icons.event_available,
                    'Dropoff: ',
                    mission['details']?['dropoffDate']?.toString(),
                  ),
                  _buildCardInfoChip(
                    Icons.monitor_weight_outlined,
                    'Weight: ',
                    mission['details']?['vehicleWeight']?.toString(),
                  ),
                ],
              )
            else if (mission['type'] == 'INSPECTION')
              Wrap(
                children: [
                  _buildCardInfoChip(
                    Icons.calendar_today,
                    '',
                    '${mission['details']?['inspectionDate'] ?? ''} ${mission['details']?['inspectionTime'] ?? ''}'
                        .trim(),
                  ),
                ],
              )
            else if (mission['type'] == 'HIRE_DRIVER')
              Builder(
                builder: (context) {
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
    final type = m['type'];
    final d = m['details'] ?? {};
    if (type == 'TRANSPORT') {
      final yearStr =
          (d['year'] != null &&
              d['year'].toString().trim().isNotEmpty &&
              d['year'].toString() != 'null')
          ? '(${d['year']})'
          : '';
      return Column(
        children: [
          _buildInfoRow('Type', 'Vehicle Transport'),
          _buildInfoRow(
            'Vehicle',
            '${d['make'] ?? ''} ${d['model'] ?? ''} ${_formatEnum(d['vehicleType']?.toString())} $yearStr',
          ),
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
          _buildInfoRow('Pickup Date', d['pickupDate']?.toString()),
          _buildInfoRow('Dropoff Date', d['dropoffDate']?.toString()),
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
            '${d['inspectionDate'] ?? ''} ${d['inspectionTime'] != null && d['inspectionTime'].toString() != 'null' && d['inspectionTime'].toString().isNotEmpty ? 'at ${d['inspectionTime']}' : ''}',
          ),
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
            '${d['driverStartDate'] ?? ''} ${d['driverStartTime'] ?? ''}',
          ),
          _buildInfoRow(
            'End',
            '${d['driverEndDate'] ?? ''} ${d['driverEndTime'] ?? ''}',
          ),
          _buildInfoRow('Notes', d['driverTaskNotes']?.toString()),
        ],
      );
    }
    return const SizedBox.shrink();
  }

  void _showQuoteDialog(Map<String, dynamic> mission, String displayId) {
    final amountCtrl = TextEditingController(
      text: mission['myQuoteAmount']?.toString() ?? '',
    );
    final notesCtrl = TextEditingController(
      text: mission['myQuoteMessage']?.toString() ?? '',
    );
    final timeCtrl = TextEditingController(
      text: mission['myQuoteTime']?.toString() ?? '',
    );
    final isUpdate = mission['myQuoteStatus'] != null;
    final isLoading = false.obs;

    Get.bottomSheet(
      Builder(
        builder: (context) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: Container(
            padding: EdgeInsets.only(
              left: 24,
              right: 24,
              top: 24,
              bottom: 24 + MediaQuery.of(context).padding.bottom,
            ),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
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
                  TextField(
                    controller: amountCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Amount (€)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const Gap(height: 12),
                  TextField(
                    controller: notesCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Message / Notes',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 2,
                  ),
                  const Gap(height: 12),
                  TextField(
                    controller: timeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Estimated Time (e.g., 2 hours)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const Gap(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                      ),
                      onPressed: () async {
                        if (amountCtrl.text.isEmpty || isLoading.value) return;
                        isLoading.value = true;
                        try {
                          final repo = MissionRepository();
                          await repo.submitQuote(
                            mission['_id'],
                            double.parse(amountCtrl.text),
                            notesCtrl.text,
                            timeCtrl.text,
                          );
                          // Dismiss keyboard to prevent it from consuming the back event
                          FocusManager.instance.primaryFocus?.unfocus();
                          
                          // Ensure we close the bottom sheet robustly
                          if (Navigator.canPop(context)) {
                            Navigator.pop(context);
                          } else {
                            Get.back();
                          }
                          Get.snackbar(
                            'Success',
                            isUpdate
                                ? 'Quote updated successfully'
                                : 'Quote submitted successfully',
                            snackPosition: SnackPosition.bottom,
                            backgroundColor: const Color(0xFF10B981),
                            colorText: Colors.white,
                            borderRadius: 12,
                            margin: const EdgeInsets.all(16),
                            icon: const Icon(
                              Icons.check_circle,
                              color: Colors.white,
                            ),
                            duration: const Duration(seconds: 3),
                            isDismissible: true,
                            forwardAnimationCurve: Curves.easeOutBack,
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
                            duration: const Duration(seconds: 3),
                            isDismissible: true,
                            forwardAnimationCurve: Curves.easeOutBack,
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
                ],
              ),
            ),
          ),
        ),
      ),
      isScrollControlled: true,
    );
  }
}
