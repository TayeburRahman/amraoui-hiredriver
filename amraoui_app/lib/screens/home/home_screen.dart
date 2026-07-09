import 'package:amraoui_app/models/driver_model.dart';
import 'package:amraoui_app/service/repository/auth_repository.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:amraoui_app/routes/app_routes.dart';
import 'package:amraoui_app/screens/navigation/controllers/navigation_controller.dart';
import 'package:amraoui_app/screens/notifications/notifications_screen.dart';
import 'package:amraoui_app/service/repository/notification_repository.dart';
import 'package:amraoui_app/widgets/cards/location_timeline_widget.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

// ─── Controller ───────────────────────────────────────────────────────────────

class HomeController extends GetxController {
  final _authRepo = AuthRepository();
  final _missionRepo = MissionRepository();
  final _notifRepo = NotificationRepository();

  var isLoading = true.obs;
  var profile = Rx<DriverModel?>(null);
  var missions = [].obs;
  var unreadNotifications = 0.obs;

  // Computed counts
  int get availableMissions =>
      missions.where((m) => m['myQuoteStatus'] == null).length;

  int get activeMissions => missions.where((m) {
    final status = (m['status'] ?? '').toString();
    return m['myQuoteStatus'] == 'ACCEPTED' &&
        (status == 'ASSIGNED' || status == 'IN_PROGRESS');
  }).length;

  int get pendingQuotes =>
      missions.where((m) => m['myQuoteStatus'] == 'PENDING').length;

  int get completedMissions => missions
      .where((m) => (m['status'] ?? '').toString() == 'COMPLETED')
      .length;

  // Active mission (first ASSIGNED/IN_PROGRESS where my quote accepted)
  Map<String, dynamic>? get activeMission {
    try {
      return missions.firstWhere((m) {
            final status = (m['status'] ?? '').toString();
            return m['myQuoteStatus'] == 'ACCEPTED' &&
                (status == 'ASSIGNED' || status == 'IN_PROGRESS');
          })
          as Map<String, dynamic>?;
    } catch (_) {
      return null;
    }
  }

  // Recent quotes (missions where I submitted a quote, sorted newest first)
  List<Map<String, dynamic>> get recentQuotes {
    final quoted = missions
        .where((m) => m['myQuoteStatus'] != null)
        .take(5)
        .map((m) => m as Map<String, dynamic>)
        .toList();
    return quoted;
  }

  String get greeting {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  @override
  void onInit() {
    super.onInit();
    fetchAll();
  }

  Future<void> fetchAll() async {
    isLoading(true);
    try {
      await Future.wait([_fetchProfile(), _fetchMissions(), _fetchNotifications()]);
    } catch (e) {
      print('HomeController fetchAll error: $e');
    } finally {
      isLoading(false);
    }
  }

  Future<void> _fetchNotifications() async {
    try {
      final res = await _notifRepo.getNotifications();
      if (res.data != null && res.data['success'] == true) {
        final List notifs = res.data['data'] ?? [];
        unreadNotifications.value = notifs.where((n) => !(n['isRead'] ?? false)).length;
      }
    } catch (e) {
      print('HomeController _fetchNotifications error: $e');
    }
  }

  Future<void> _fetchProfile() async {
    try {
      final p = await _authRepo.getProfile();
      profile.value = p;
    } catch (e) {
      print('HomeController _fetchProfile error: $e');
    }
  }

  Future<void> _fetchMissions() async {
    try {
      final res = await _missionRepo.getMissions();
      if (res.data != null && res.data['success'] == true) {
        missions.value = res.data['data'];
      }
    } catch (e) {
      print('HomeController _fetchMissions error: $e');
    }
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final HomeController controller;

  @override
  void initState() {
    super.initState();
    controller = Get.put(HomeController());
  }

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
                children: [_buildHeader(controller), const Gap(height: 8)],
              ),
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: controller.fetchAll,
          color: const Color(0xFF2563EB),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 24)),
            child: Obx(() {
              if (controller.isLoading.value) {
                return const SizedBox(
                  height: 400,
                  child: Center(child: CircularProgressIndicator()),
                );
              }
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Gap(height: 16),
                  _buildStatusChip(controller),
                  const Gap(height: 32),
                  _buildSummaryGrid(controller),
                  const Gap(height: 32),
                  const AppText(
                    data: 'Active Mission',
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                  ),
                  const Gap(height: 16),
                  Obx(() => _buildActiveMissionSection(controller)),
                  const Gap(height: 32),
                  const AppText(
                    data: 'Recent Quotes',
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                  ),
                  const Gap(height: 16),
                  Obx(() => _buildRecentQuotesList(controller)),
                  const Gap(height: 100),
                ],
              );
            }),
          ),
        ),
      ),
    );
  }

  // ── Header ──────────────────────────────────────────────────────────────────

  Widget _buildHeader(HomeController c) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              AppText(
                data: c.greeting,
                fontSize: 14,
                color: const Color(0xFF64748B),
              ),
              Obx(
                () => AppText(
                  data: c.profile.value?.name ?? 'Driver',
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const Gap(height: 4),
              const AppText(
                data: "Ready for today's missions?",
                fontSize: 14,
                color: Color(0xFF64748B),
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        GestureDetector(
          onTap: () {
            Get.to(() => const NotificationsScreen())?.then((_) => c._fetchNotifications());
          },
          child: Container(
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
                Obx(() {
                  if (c.unreadNotifications.value == 0) return const SizedBox.shrink();
                  return Positioned(
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
                  );
                }),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ── Status chip ─────────────────────────────────────────────────────────────

  Widget _buildStatusChip(HomeController c) {
    return Obx(() {
      final active = c.activeMissions > 0;
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: active ? const Color(0xFFF0FDF4) : const Color(0xFFFFF7ED),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: active
                    ? const Color(0xFF22C55E)
                    : const Color(0xFFF59E0B),
                shape: BoxShape.circle,
              ),
            ),
            const Gap(width: 8),
            AppText(
              data: active
                  ? 'Active mission in progress'
                  : 'Available for missions',
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: active ? const Color(0xFF166534) : const Color(0xFF92400E),
            ),
          ],
        ),
      );
    });
  }

  // ── Summary grid ────────────────────────────────────────────────────────────

  Widget _buildSummaryGrid(HomeController c) {
    return Obx(
      () => GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 1.1,
        children: [
          _buildSummaryCard(
            title: 'Available missions',
            count: '${c.availableMissions}',
            subtitle: 'New tasks nearby',
            icon: Icons.assignment_outlined,
            iconColor: const Color(0xFF2563EB),
            bgColor: const Color(0xFFEFF6FF),
            onTap: () => _switchTab(1),
          ),
          _buildSummaryCard(
            title: 'Assigned missions',
            count: c.activeMissions.toString().padLeft(2, '0'),
            subtitle: 'Ready to start',
            icon: Icons.account_tree_outlined,
            iconColor: const Color(0xFF10B981),
            bgColor: const Color(0xFFECFDF5),
            onTap: () => _switchTab(1),
          ),
          _buildSummaryCard(
            title: 'Pending quotes',
            count: c.pendingQuotes.toString().padLeft(2, '0'),
            subtitle: 'Waiting approval',
            icon: Icons.description_outlined,
            iconColor: const Color(0xFFF59E0B),
            bgColor: const Color(0xFFFFFBEB),
            onTap: () => _switchTab(2),
          ),
          _buildSummaryCard(
            title: 'Completed jobs',
            count: '${c.completedMissions}',
            subtitle: 'Total completed',
            icon: Icons.check_circle_outline,
            iconColor: const Color(0xFF22C55E),
            bgColor: const Color(0xFFF0FDF4),
            onTap: () => _switchTab(1),
          ),
        ],
      ),
    );
  }

  // ── Active Mission section ───────────────────────────────────────────────────

  Widget _buildActiveMissionSection(HomeController c) {
    final mission = c.activeMission;
    if (mission == null) {
      return _buildNoActiveMission();
    }
    return _buildActiveMissionCard(Map<String, dynamic>.from(mission));
  }

  Widget _buildNoActiveMission() {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFFF1F5F9),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.directions_car_outlined,
              size: 32,
              color: Color(0xFF94A3B8),
            ),
          ),
          const Gap(height: 16),
          const AppText(
            data: 'No active mission',
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: Color(0xFF334155),
          ),
          const Gap(height: 6),
          const AppText(
            data: 'Submit quotes to get assigned to missions.',
            fontSize: 13,
            color: Color(0xFF94A3B8),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildActiveMissionCard(Map<String, dynamic> mission) {
    final type = mission['type'] ?? '';
    final d = mission['details'] ?? {};
    final missionId =
        mission['missionId'] ??
        '#MS-${(mission['_id'] as String).substring((mission['_id'] as String).length - 5).toUpperCase()}';
    final status = (mission['status'] ?? '').toString();
    String price = 'TBD';
    if (mission['adminQuote'] != null) {
      final driverPrice = mission['adminQuote']['driverPrice']?.toString();
      if (driverPrice != null &&
          driverPrice.isNotEmpty &&
          driverPrice != 'null') {
        price = '€$driverPrice';
      }
    }

    // Build location label
    String fromLabel = '';
    String toLabel = '';
    String vehicleLabel = '';
    String dateLabel = '';

    if (type == 'TRANSPORT') {
      fromLabel = d['pickupCity']?.toString().trim().isNotEmpty == true
          ? d['pickupCity'].toString()
          : d['pickupAddress']?.toString() ?? '';
      toLabel = d['dropoffCity']?.toString().trim().isNotEmpty == true
          ? d['dropoffCity'].toString()
          : d['dropoffAddress']?.toString() ?? '';
      final mk = d['make']?.toString() ?? '';
      final md = d['model']?.toString() ?? '';
      vehicleLabel = [mk, md].where((s) => s.isNotEmpty).join(' ');
      dateLabel = d['pickupDate']?.toString() ?? '';
    } else if (type == 'HIRE_DRIVER') {
      fromLabel =
          d['driverCity']?.toString() ?? d['driverLocation']?.toString() ?? '';
      toLabel = '';
      dateLabel = d['driverStartDate']?.toString() ?? '';
    } else if (type == 'INSPECTION') {
      fromLabel = d['inspectionLocation']?.toString() ?? '';
      toLabel = '';
      final vb = d['vehicleBrand']?.toString() ?? '';
      final vm = d['vehicleModel']?.toString() ?? '';
      vehicleLabel = [vb, vm].where((s) => s.isNotEmpty).join(' ');
      dateLabel = d['inspectionDate']?.toString() ?? '';
    }

    final statusLabel = status == 'IN_PROGRESS' ? 'In Progress' : 'Assigned';
    final statusBg = status == 'IN_PROGRESS'
        ? const Color(0xFFEFF6FF)
        : const Color(0xFFF0FDF4);
    final statusColor = status == 'IN_PROGRESS'
        ? const Color(0xFF2563EB)
        : const Color(0xFF22C55E);

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
              AppText(
                data: missionId,
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: AppText(
                  data: statusLabel,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: statusColor,
                ),
              ),
            ],
          ),
          const Gap(height: 20),
          LocationTimelineWidget(mission: mission),
          const Gap(height: 16),
          if (vehicleLabel.isNotEmpty) ...[
            _buildInfoRow('Vehicle', vehicleLabel),
            const Gap(height: 12),
          ],
          if (dateLabel.isNotEmpty) ...[
            _buildInfoRow('Date', dateLabel),
            const Gap(height: 12),
          ],
          const Gap(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const AppText(data: 'Mission price', color: Color(0xFF64748B)),
              AppText(
                data: price,
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: const Color(0xFF2563EB),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Recent Quotes list ───────────────────────────────────────────────────────

  Widget _buildRecentQuotesList(HomeController c) {
    final quotes = List<Map<String, dynamic>>.from(c.recentQuotes);
    if (quotes.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: const Center(
          child: AppText(
            data: 'No quotes submitted yet.',
            fontSize: 14,
            color: Color(0xFF94A3B8),
          ),
        ),
      );
    }

    return Column(
      children: quotes.asMap().entries.map<Widget>((entry) {
        final i = entry.key;
        final m = entry.value;
        final type = m['type'] ?? '';
        final d = m['details'] ?? {};
        final quoteStatus = (m['myQuoteStatus'] ?? '').toString();
        final amount = m['myQuoteAmount'] != null
            ? '€${m['myQuoteAmount']}'
            : '—';

        String label = 'Mission';
        if (type == 'TRANSPORT') {
          final from = d['pickupCity']?.toString().trim() ?? '';
          final to = d['dropoffCity']?.toString().trim() ?? '';
          label = (from.isNotEmpty && to.isNotEmpty)
              ? '$from → $to'
              : 'Transport';
        } else if (type == 'HIRE_DRIVER') {
          label = d['driverCity']?.toString().trim().isNotEmpty == true
              ? d['driverCity'].toString()
              : 'Hire Driver';
        } else if (type == 'INSPECTION') {
          label = d['inspectionLocation']?.toString().trim().isNotEmpty == true
              ? d['inspectionLocation'].toString()
              : 'Inspection';
        }

        String subLabel = '';
        if (type == 'TRANSPORT') {
          final mk = d['make']?.toString() ?? '';
          final md = d['model']?.toString() ?? '';
          subLabel = [mk, md].where((s) => s.isNotEmpty).join(' ');
        } else if (type == 'INSPECTION') {
          subLabel = [
            d['vehicleBrand'],
            d['vehicleModel'],
          ].where((s) => s != null && s.toString().isNotEmpty).join(' ');
        } else if (type == 'HIRE_DRIVER') {
          final cnt = d['driverCount']?.toString() ?? '';
          subLabel = cnt.isNotEmpty ? '$cnt Driver(s)' : 'Hire Driver';
        }

        Color statusBg;
        Color statusColor;
        String statusLabel;
        if (quoteStatus == 'ACCEPTED') {
          statusBg = const Color(0xFFF0FDF4);
          statusColor = const Color(0xFF22C55E);
          statusLabel = 'Accepted';
        } else if (quoteStatus == 'REJECTED') {
          statusBg = const Color(0xFFFEE2E2);
          statusColor = const Color(0xFFDC2626);
          statusLabel = 'Rejected';
        } else {
          statusBg = const Color(0xFFFFFBEB);
          statusColor = const Color(0xFFF59E0B);
          statusLabel = 'Pending';
        Widget missionIconWidget = const Icon(Icons.directions_car_outlined, color: Color(0xFF2563EB), size: 20);

        if (type == 'TRANSPORT') {
          final deliveryType = d['deliveryType'] ?? '';
          if (deliveryType == 'tow') {
            missionIconWidget = const Icon(Icons.local_shipping_outlined, color: Color(0xFF2563EB), size: 20);
          } else if (deliveryType == 'license') {
            missionIconWidget = Stack(
              alignment: Alignment.center,
              children: [
                const Icon(Icons.directions_car_outlined, color: Color(0xFF2563EB), size: 20),
                Positioned(
                  bottom: 2,
                  child: Container(
                    width: 8,
                    height: 4,
                    decoration: BoxDecoration(color: Colors.green, borderRadius: BorderRadius.circular(1)),
                  ),
                ),
              ],
            );
          }
        } else if (type == 'HIRE_DRIVER') {
          missionIconWidget = const Icon(Icons.person_outline, color: Color(0xFF2563EB), size: 20);
        } else if (type == 'INSPECTION') {
          missionIconWidget = const Icon(Icons.fact_check_outlined, color: Color(0xFF2563EB), size: 20);
        }

        return Padding(
          padding: EdgeInsets.only(bottom: i < quotes.length - 1 ? 12 : 0),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: missionIconWidget,
                ),
                const Gap(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppText(
                        data: label,
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                      ),
                      if (subLabel.isNotEmpty)
                        AppText(
                          data: subLabel,
                          fontSize: 13,
                          color: const Color(0xFF64748B),
                        ),
                      const Gap(height: 4),
                      AppText(
                        data: amount,
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: const Color(0xFF0F172A),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: statusBg,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: AppText(
                    data: statusLabel,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: statusColor,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  void _switchTab(int index) {
    if (Get.isRegistered<NavigationController>()) {
      Get.find<NavigationController>().changeIndex(index);
    }
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
            AppText(
              data: subtitle,
              fontSize: 11,
              color: const Color(0xFF94A3B8),
            ),
          ],
        ),
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
}
