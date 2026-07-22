import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/screens/navigation/navigation_screen.dart';

class MissionCompleteScreen extends StatelessWidget {
  final Map<String, dynamic> mission;

  const MissionCompleteScreen({super.key, required this.mission});

  @override
  Widget build(BuildContext context) {
    final type = mission['type'];
    final detailsObj = mission['details'] ?? {};

    String routeText = 'Unknown';
    if (type == 'TRANSPORT') {
      final pCity = detailsObj['pickupCity']?.toString().trim() ?? '';
      final pAddr = detailsObj['pickupAddress']?.toString().trim() ?? '';
      final p = (pCity.isNotEmpty && pCity != 'null')
          ? pCity
          : ((pAddr.isNotEmpty && pAddr != 'null') ? pAddr : 'Pickup');

      final dCity = detailsObj['dropoffCity']?.toString().trim() ?? '';
      final dAddr = detailsObj['dropoffAddress']?.toString().trim() ?? '';
      final d = (dCity.isNotEmpty && dCity != 'null')
          ? dCity
          : ((dAddr.isNotEmpty && dAddr != 'null') ? dAddr : 'Dropoff');

      routeText = '$p → $d';
    } else if (type == 'INSPECTION') {
      final l = detailsObj['inspectionLocation']?.toString().trim() ?? '';
      routeText = (l.isNotEmpty && l != 'null') ? l : 'Inspection Location';
    } else if (type == 'HIRE_DRIVER') {
      final c = detailsObj['driverCity']?.toString().trim() ?? '';
      final l = detailsObj['driverLocation']?.toString().trim() ?? '';
      routeText = (c.isNotEmpty && c != 'null')
          ? c
          : ((l.isNotEmpty && l != 'null') ? l : 'Driver Location');
    }

    String vehicleText = 'Unknown Vehicle';
    if (type == 'TRANSPORT') {
      final mk = (detailsObj['make'] ?? '').toString().trim();
      final md = (detailsObj['model'] ?? '').toString().trim();
      vehicleText = [
        mk,
        md,
      ].where((p) => p.isNotEmpty && p != 'null').join(' ');
    } else if (type == 'INSPECTION') {
      final vb = (detailsObj['vehicleBrand'] ?? '').toString().trim();
      final vm = (detailsObj['vehicleModel'] ?? '').toString().trim();
      vehicleText = [
        vb,
        vm,
      ].where((p) => p.isNotEmpty && p != 'null').join(' ');
    }
    if (vehicleText.isEmpty) vehicleText = 'Not specified';

    String distanceText = detailsObj['distance']?.toString() ?? 'N/A';
    try {
      double pMileage = double.parse(
        detailsObj['pickupInspection']?['mileageAndFuel']?['mileage']
                ?.toString() ??
            '0',
      );
      double dMileage = double.parse(
        detailsObj['deliveryInspection']?['mileageAndFuel']?['mileage']
                ?.toString() ??
            '0',
      );
      if (dMileage > 0 && dMileage >= pMileage) {
        distanceText = '${dMileage - pMileage}';
      }
    } catch (_) {}

    if (!distanceText.endsWith('km') &&
        distanceText != 'N/A' &&
        distanceText.isNotEmpty &&
        distanceText != 'null') {
      distanceText = '$distanceText km';
    } else if (distanceText.isEmpty || distanceText == 'null') {
      distanceText = 'N/A';
    }

    String durationText = detailsObj['estimatedTime']?.toString() ?? 'N/A';
    try {
      String? startStr = detailsObj['startedAt']?.toString();
      if (startStr == null) {
        if (type == 'HIRE_DRIVER') {
          final arr = detailsObj['driverArrivals'];
          if (arr != null && arr is List && arr.isNotEmpty) {
            startStr = arr.first['verifiedAt']?.toString();
          }
        } else {
          startStr = detailsObj['pickupVerification']?['verifiedAt']?.toString();
        }
      }

      String? endStr = detailsObj['completedAt']?.toString() ?? 
          detailsObj['deliveryArrivalTime']?.toString();

      if (startStr != null) {
        DateTime start = DateTime.parse(startStr).toLocal();
        DateTime end = DateTime.parse(endStr).toLocal();
        
        // Ensure end is not before start
        if (end.isBefore(start)) {
          end = start;
        }

        Duration diff = end.difference(start);
        int days = diff.inDays;
        int hours = diff.inHours.remainder(24);
        int mins = diff.inMinutes.remainder(60);
        
        if (days > 0) {
          durationText = '$days d $hours h';
        } else if (hours > 0) {
          durationText = '$hours h $mins m';
        } else {
          durationText = '$mins min';
        }
      }
    } catch (e) {
      debugPrint('Error calculating duration: $e');
    }

    if (durationText.isEmpty || durationText == 'null') {
      durationText = 'N/A';
    }

    final realId = mission['_id'] ?? '';
    final String missionIdText =
        mission['missionId'] ??
        (realId.isNotEmpty
            ? '#REQ-${(realId as String).substring((realId as String).length - 5).toUpperCase()}'
            : 'Unknown Reference');

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Gap(height: 24),
              // Top Green Card
              Container(
                padding: const EdgeInsets.symmetric(
                  vertical: 32,
                  horizontal: 16,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.check_circle_outline,
                          color: Color(0xFF10B981),
                          size: 32,
                        ),
                      ),
                    ),
                    const Gap(height: 16),
                    const AppText(
                      data: 'Mission Complete!',
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    const Gap(height: 8),
                    AppText(
                      data: missionIdText,
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ],
                ),
              ),
              const Gap(height: 16),

              // Mission Summary Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const AppText(
                      data: 'Mission Summary',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                    const Gap(height: 16),
                    if (type == 'TRANSPORT') ...[
                      _buildSummaryRow('Route', routeText),
                      const Gap(height: 12),
                      _buildSummaryRow('Vehicle', vehicleText),
                      const Gap(height: 12),
                      _buildSummaryRow('Distance', distanceText),
                      const Gap(height: 12),
                      _buildSummaryRow('Duration', durationText),
                    ] else if (type == 'INSPECTION') ...[
                      _buildSummaryRow('Location', routeText),
                      const Gap(height: 12),
                      _buildSummaryRow('Vehicle', vehicleText),
                      const Gap(height: 12),
                      _buildSummaryRow(
                        'Type',
                        detailsObj['inspectionType']?.toString() ?? 'N/A',
                      ),
                      const Gap(height: 12),
                      _buildSummaryRow(
                        'Date',
                        '${detailsObj['inspectionDate'] ?? 'N/A'} ${detailsObj['inspectionTime'] ?? ''}',
                      ),
                    ] else if (type == 'HIRE_DRIVER') ...[
                      _buildSummaryRow('Location', routeText),
                      const Gap(height: 12),
                      _buildSummaryRow(
                        'Start',
                        '${detailsObj['driverStartDate'] ?? 'N/A'} ${detailsObj['driverStartTime'] ?? ''}',
                      ),
                      const Gap(height: 12),
                      _buildSummaryRow(
                        'End',
                        '${detailsObj['driverEndDate'] ?? 'N/A'} ${detailsObj['driverEndTime'] ?? ''}',
                      ),
                      const Gap(height: 12),
                      _buildSummaryRow(
                        'Tasks',
                        (detailsObj['driverTasks'] is List)
                            ? (detailsObj['driverTasks'] as List)
                                  .join(', ')
                                  .replaceAll('_', ' ')
                            : 'N/A',
                      ),
                    ],
                  ],
                ),
              ),
              const Gap(height: 16),

              // Completed Tasks Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const AppText(
                      data: 'Completed Tasks',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                    const Gap(height: 16),
                    if (type == 'INSPECTION') ...[
                      _buildTaskRow('Arrival declared'),
                      const Gap(height: 12),
                      _buildTaskRow('Vehicle match confirmed'),
                      const Gap(height: 12),
                      _buildTaskRow('Technical inspection completed'),
                      const Gap(height: 12),
                      _buildTaskRow('Customer signature obtained'),
                    ] else if (type == 'HIRE_DRIVER') ...[
                      _buildTaskRow('Client arrival declared'),
                      const Gap(height: 12),
                      _buildTaskRow('Pre-trip check completed'),
                      const Gap(height: 12),
                      _buildTaskRow('Driver duties performed'),
                      const Gap(height: 12),
                      _buildTaskRow('Post-trip handover completed'),
                      const Gap(height: 12),
                      _buildTaskRow('Customer signature obtained'),
                    ] else ...[
                      _buildTaskRow('Pickup verification completed'),
                      const Gap(height: 12),
                      _buildTaskRow('Pickup inspection completed'),
                      const Gap(height: 12),
                      _buildTaskRow('Vehicle delivered on time'),
                      const Gap(height: 12),
                      _buildTaskRow('Delivery inspection completed'),
                      const Gap(height: 12),
                      _buildTaskRow('Customer signature obtained'),
                    ],
                  ],
                ),
              ),
              const Gap(height: 16),

              // Info Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: const AppText(
                  data:
                      'Excellent work! The mission has been completed successfully and all documentation has been submitted.',
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF065F46),
                  textAlign: TextAlign.center,
                ),
              ),

              const Gap(height: 100),
            ],
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: SizedBox(
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
            onPressed: () {
              Get.offAll(() => const NavigationScreen());
            },
            child: Ink(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF3B82F6), // Blue
                    Color(0xFFA855F7), // Purple
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Container(
                alignment: Alignment.center,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.home_outlined, color: Colors.white, size: 18),
                    Gap(width: 8),
                    AppText(
                      data: 'Return to Dashboard',
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        AppText(data: label, fontSize: 14, color: const Color(0xFF64748B)),
        AppText(
          data: value,
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: const Color(0xFF0F172A),
        ),
      ],
    );
  }

  Widget _buildTaskRow(String task) {
    return Row(
      children: [
        const Icon(
          Icons.check_circle_outline,
          color: Color(0xFF10B981),
          size: 20,
        ),
        const Gap(width: 12),
        Expanded(
          child: AppText(
            data: task,
            fontSize: 14,
            color: const Color(0xFF475569),
          ),
        ),
      ],
    );
  }
}
