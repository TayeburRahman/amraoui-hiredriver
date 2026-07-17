import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:Vehiqqo/service/repository/mission_repository.dart';
import 'package:intl/intl.dart';
import 'mission_complete_screen.dart';

class MultiDayArrivalScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;

  const MultiDayArrivalScreen({
    super.key,
    required this.mission,
    required this.reqId,
  });

  @override
  State<MultiDayArrivalScreen> createState() => _MultiDayArrivalScreenState();
}

class _MultiDayArrivalScreenState extends State<MultiDayArrivalScreen> {
  LatLng? driverLocation;
  bool isLoadingLocation = true;
  late Map<String, dynamic> localMission;

  @override
  void initState() {
    super.initState();
    localMission = Map.from(widget.mission);
    _fetchDriverLocation();
  }

  Future<void> _fetchDriverLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() => isLoadingLocation = false);
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.deniedForever) {
        setState(() => isLoadingLocation = false);
        return;
      }

      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission != LocationPermission.whileInUse &&
            permission != LocationPermission.always) {
          setState(() => isLoadingLocation = false);
          return;
        }
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      if (mounted) {
        setState(() {
          driverLocation = LatLng(position.latitude, position.longitude);
          isLoadingLocation = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => isLoadingLocation = false);
      }
    }
  }

  List<DateTime> _getDaysInRange(String startDateStr, String endDateStr) {
    try {
      final start = DateTime.parse(startDateStr);
      final end = DateTime.parse(endDateStr);

      final daysToGenerate = end.difference(start).inDays + 1;

      if (daysToGenerate <= 0) return [start];

      return List.generate(daysToGenerate, (i) => start.add(Duration(days: i)));
    } catch (e) {
      return [DateTime.now()];
    }
  }

  Future<void> _declareArrivalForDate(String dateStr) async {
    if (driverLocation == null) {
      Get.snackbar(
        'Location Required',
        'Please wait for your location to be found or enable GPS.',
        backgroundColor: const Color(0xFFF59E0B),
        colorText: Colors.white,
        snackPosition: SnackPosition.bottom,
        margin: const EdgeInsets.all(16),
      );
      return;
    }

    Get.dialog(
      const Center(child: CircularProgressIndicator()),
      barrierDismissible: false,
    );

    try {
      final repo = MissionRepository();
      final res = await repo.verifyPickup(
        localMission['_id'],
        driverLocation!.latitude,
        driverLocation!.longitude,
        date: dateStr,
      );

      Get.back(); // close loading dialog

      if (res.statusCode == 200) {
        setState(() {
          if (localMission['details'] == null) {
            localMission['details'] = <String, dynamic>{};
          }
          if (localMission['details']['driverArrivals'] == null) {
            localMission['details']['driverArrivals'] = [];
          }

          localMission['details']['driverArrivals'].add({
            'date': dateStr,
            'verifiedAt': DateTime.now().toIso8601String(),
          });
        });

        Get.snackbar(
          'Arrival Declared',
          'Successfully checked in for $dateStr',
          backgroundColor: const Color(0xFF10B981),
          colorText: Colors.white,
          snackPosition: SnackPosition.bottom,
          margin: const EdgeInsets.all(16),
        );
      } else {
        Get.snackbar('Error', 'Failed to verify pickup');
      }
    } catch (e) {
      Get.back(); // close loading dialog
      Get.snackbar('Error', 'Network error. Please try again.');
    }
  }

  Future<void> _completeMission() async {
    Get.dialog(
      const Center(child: CircularProgressIndicator()),
      barrierDismissible: false,
    );

    try {
      final repo = MissionRepository();
      final res = await repo.updateDeliveryInspection(
        localMission['_id'],
        'driverConfirmation',
        {},
      );

      Get.back(); // close loading dialog

      if (res.statusCode == 200) {
        Get.snackbar(
          'Success',
          'Mission completed successfully!',
          backgroundColor: const Color(0xFF10B981),
          colorText: Colors.white,
          snackPosition: SnackPosition.bottom,
        );
        Get.off(() => MissionCompleteScreen(mission: localMission));
      } else {
        Get.snackbar('Error', 'Failed to complete mission');
      }
    } catch (e) {
      Get.back(); // close loading dialog
      Get.snackbar('Error', 'An error occurred while completing the mission.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final details = localMission['details'] ?? {};
    final pLocation =
        details['driverLocation'] ??
        details['driverCity'] ??
        'Unknown Location';
    final startDateStr = details['driverStartDate'] ?? '';
    final endDateStr = details['driverEndDate'] ?? '';
    final driverArrivals = details['driverArrivals'] as List<dynamic>? ?? [];

    final days = _getDaysInRange(startDateStr, endDateStr);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFC),
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Get.back(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const AppText(
                data: 'Client Arrival Declaration',
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              AppText(
                data: 'Mission ID: ${widget.reqId}',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF64748B),
              ),
              const Gap(height: 24),

              // Location Card
              _buildCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_outlined,
                          color: Color(0xFF06B6D4),
                          size: 20,
                        ),
                        const Gap(width: 8),
                        const AppText(
                          data: 'Client Location',
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ],
                    ),
                    const Gap(height: 16),
                    const AppText(
                      data: 'Address',
                      fontSize: 12,
                      color: Color(0xFF64748B),
                    ),
                    AppText(
                      data: pLocation,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF0F172A),
                    ),
                    const Gap(height: 16),
                    Container(
                      height: 150,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: isLoadingLocation
                          ? const Center(child: CircularProgressIndicator())
                          : (driverLocation != null
                                ? FlutterMap(
                                    options: MapOptions(
                                      initialCenter: driverLocation!,
                                      initialZoom: 14.0,
                                    ),
                                    children: [
                                      TileLayer(
                                        urlTemplate:
                                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                                        userAgentPackageName: 'com.amraoui.app',
                                      ),
                                      MarkerLayer(
                                        markers: [
                                          Marker(
                                            point: driverLocation!,
                                            width: 40,
                                            height: 40,
                                            child: const Icon(
                                              Icons.location_on,
                                              color: Colors.blue,
                                              size: 40,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  )
                                : const Center(
                                    child: Icon(
                                      Icons.location_off,
                                      color: Color(0xFF94A3B8),
                                      size: 32,
                                    ),
                                  )),
                    ),
                  ],
                ),
              ),
              const Gap(height: 16),

              // Daily Check-ins
              const AppText(
                data: 'Daily Check-ins',
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
              const Gap(height: 12),

              ...days.map((date) {
                final dateStr = DateFormat('yyyy-MM-dd').format(date);
                final displayDate = DateFormat('dd/MM/yyyy').format(date);

                final existingArrival = driverArrivals.firstWhere(
                  (a) => a['date'] == dateStr,
                  orElse: () => null,
                );

                final hasArrived = existingArrival != null;
                final verifiedAt =
                    hasArrived && existingArrival['verifiedAt'] != null
                    ? DateFormat(
                        'HH:mm',
                      ).format(DateTime.parse(existingArrival['verifiedAt']))
                    : '';

                return _buildCard(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          AppText(
                            data: displayDate,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF0F172A),
                          ),
                          if (hasArrived) ...[
                            const Gap(height: 4),
                            AppText(
                              data: 'Arrived at $verifiedAt',
                              fontSize: 13,
                              color: const Color(0xFF10B981),
                            ),
                          ],
                        ],
                      ),
                      if (hasArrived)
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFD1FAE5),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.check,
                            color: Color(0xFF10B981),
                            size: 20,
                          ),
                        )
                      else
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF06B6D4),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                          ),
                          onPressed: () => _declareArrivalForDate(dateStr),
                          child: const AppText(
                            data: 'Declare Arrival',
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                    ],
                  ),
                );
              }).toList(),

              const Gap(height: 24),

              // Complete Mission Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.zero,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  onPressed: _completeMission,
                  child: Ink(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF3B82F6), Color(0xFFA855F7)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Container(
                      alignment: Alignment.center,
                      child: const AppText(
                        data: 'Complete Mission',
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                  ),
                ),
              ),

              const Gap(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard({required Widget child}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: child,
    );
  }
}
