import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/screens/navigation/navigation_screen.dart';

class MissionCompleteScreen extends StatelessWidget {
  final Map<String, dynamic> mission;

  const MissionCompleteScreen({super.key, required this.mission});

  String _formatEnum(String? text) {
    if (text == null || text.trim().isEmpty || text == 'null') return '';
    return text
        .replaceAll('_', ' ')
        .split(' ')
        .map((str) => str.isNotEmpty
            ? '${str[0].toUpperCase()}${str.substring(1).toLowerCase()}'
            : '')
        .join(' ');
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

  String _formatDate(dynamic dateStr) {
    if (dateStr == null || dateStr.toString().trim().isEmpty || dateStr == 'N/A' || dateStr == 'null') {
      return 'N/A';
    }
    String dStr = dateStr.toString().trim();
    if (dStr.contains('-')) {
      final parts = dStr.split('-');
      if (parts.length == 3 && parts[0].length == 4) {
        return '${parts[2]}/${parts[1]}/${parts[0]}';
      }
    }
    return dStr;
  }

  Widget _buildSummaryRow(String label, String? value) {
    final v = (value ?? '').trim();
    if (v.isEmpty || v == 'null' || v == 'N/A' || v == ',' || v == '()') {
      return const SizedBox.shrink();
    }

    String displayValue = v;
    if (displayValue.startsWith(',')) displayValue = displayValue.substring(1).trim();
    if (displayValue.endsWith(',')) displayValue = displayValue.substring(0, displayValue.length - 1).trim();
    if (displayValue.isEmpty || displayValue == 'null') return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: AppText(
              data: label,
              fontSize: 13,
              color: const Color(0xFF64748B),
            ),
          ),
          Expanded(
            flex: 3,
            child: AppText(
              data: displayValue,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF0F172A),
            ),
          ),
        ],
      ),
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

    String vehicleText = '';
    if (type == 'TRANSPORT') {
      final mk = (detailsObj['make'] ?? '').toString().trim();
      final md = (detailsObj['model'] ?? '').toString().trim();
      final vt = _formatEnum(detailsObj['vehicleType']?.toString());
      final yr = detailsObj['year'] != null ? '(${detailsObj['year']})' : '';
      vehicleText = [mk, md, vt, yr].where((p) => p.isNotEmpty && p != 'null').join(' ');
    } else if (type == 'INSPECTION') {
      final vb = (detailsObj['vehicleBrand'] ?? '').toString().trim();
      final vm = (detailsObj['vehicleModel'] ?? '').toString().trim();
      vehicleText = [vb, vm].where((p) => p.isNotEmpty && p != 'null').join(' ');
    }

    // Total Distance Calculation
    String distanceText = 'N/A';
    final dVal = detailsObj['distance']?.toString();
    if (dVal != null && dVal.isNotEmpty && dVal != 'null' && !dVal.contains('N/A')) {
      distanceText = (dVal.endsWith('km') || dVal.endsWith('mi')) ? dVal : '$dVal km';
    } else {
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
          distanceText = '${(dMileage - pMileage).toStringAsFixed(1)} km';
        }
      } catch (_) {}
    }

    // Total Duration (Start to Complete) Calculation
    String durationText = 'N/A';
    try {
      String? startStr = detailsObj['startedAt']?.toString();
      if (startStr == null || startStr.isEmpty || startStr == 'null') {
        if (type == 'HIRE_DRIVER') {
          final arr = detailsObj['driverArrivals'];
          if (arr != null && arr is List && arr.isNotEmpty) {
            startStr = arr.first['verifiedAt']?.toString();
          }
        }
        startStr ??= detailsObj['pickupVerification']?['verifiedAt']?.toString();
      }

      String? endStr = detailsObj['completedAt']?.toString() ??
          detailsObj['deliveryInspection']?['driverConfirmation']?['updatedAt']?.toString() ??
          detailsObj['deliveryArrivalTime']?.toString();

      if (startStr != null && endStr != null) {
        DateTime start = DateTime.parse(startStr).toLocal();
        DateTime end = DateTime.parse(endStr).toLocal();

        if (end.isBefore(start)) {
          end = start;
        }

        Duration diff = end.difference(start);
        int days = diff.inDays;
        int hours = diff.inHours.remainder(24);
        int mins = diff.inMinutes.remainder(60);

        if (days > 0) {
          durationText = '$days d $hours h $mins m';
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

    final isDealerPlates = detailsObj['deliveryType']?.toString().toLowerCase() == 'license' ||
        detailsObj['deliveryType']?.toString().toLowerCase().contains('dealer') == true ||
        detailsObj['deliveryType']?.toString().toLowerCase().contains('z or v') == true;

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
                      _buildSummaryRow('Type', 'Vehicle Transport'),
                      _buildSummaryRow('Vehicle', vehicleText),
                      _buildSummaryRow(
                        'Delivery Type',
                        _formatDeliveryType(detailsObj['deliveryType']?.toString()),
                      ),
                      if (isDealerPlates) ...[
                        Container(
                          margin: const EdgeInsets.only(bottom: 12),
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
                                  data: 'Dealer plates required (Z or V green plates)',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF92400E),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      _buildSummaryRow('Weight', detailsObj['vehicleWeight']?.toString()),
                      _buildSummaryRow('Condition', detailsObj['condition']?.toString()),
                      _buildSummaryRow(
                        'Pickup Location',
                        '${detailsObj['pickupAddress'] ?? ''}, ${detailsObj['pickupCity'] ?? ''}',
                      ),
                      _buildSummaryRow(
                        'Dropoff Location',
                        '${detailsObj['dropoffAddress'] ?? ''}, ${detailsObj['dropoffCity'] ?? ''}',
                      ),
                      _buildSummaryRow('Pickup Date', _formatDate(detailsObj['pickupDate'])),
                      _buildSummaryRow('Dropoff Date', _formatDate(detailsObj['dropoffDate'])),
                      _buildSummaryRow('Special Info', detailsObj['specialInstructions']?.toString()),
                      _buildSummaryRow('Total Distance', distanceText),
                      _buildSummaryRow('Total Time Taken', durationText),
                    ] else if (type == 'INSPECTION') ...[
                      _buildSummaryRow('Type', 'Technical Inspection'),
                      _buildSummaryRow(
                        'Inspection Type',
                        _formatEnum(detailsObj['inspectionType']?.toString()),
                      ),
                      _buildSummaryRow('Vehicle', vehicleText),
                      _buildSummaryRow('License Plate', detailsObj['licensePlate']?.toString()),
                      _buildSummaryRow('VIN Number', detailsObj['vinNumber']?.toString()),
                      _buildSummaryRow('Inspection Location', detailsObj['inspectionLocation']?.toString()),
                      _buildSummaryRow(
                        'Inspection Date & Time',
                        '${_formatDate(detailsObj['inspectionDate'])} ${detailsObj['inspectionTime'] != null && detailsObj['inspectionTime'].toString() != 'null' && detailsObj['inspectionTime'].toString().isNotEmpty ? 'at ${detailsObj['inspectionTime']}' : ''}'.trim(),
                      ),
                      if (detailsObj['destinationAddress']?.toString().isNotEmpty == true ||
                          detailsObj['destinationCity']?.toString().isNotEmpty == true) ...[
                        _buildSummaryRow(
                          'Dropoff Location',
                          '${detailsObj['destinationAddress'] ?? ''} ${detailsObj['destinationCity'] ?? ''}'.trim(),
                        ),
                        _buildSummaryRow(
                          'Dropoff Date & Time',
                          '${_formatDate(detailsObj['destinationDate'])} ${detailsObj['destinationTime'] != null && detailsObj['destinationTime'].toString() != 'null' && detailsObj['destinationTime'].toString().isNotEmpty ? 'at ${detailsObj['destinationTime']}' : ''}'.trim(),
                        ),
                      ],
                      _buildSummaryRow('Notes', detailsObj['inspectionNotes']?.toString()),
                      _buildSummaryRow('Total Distance', distanceText),
                      _buildSummaryRow('Total Time Taken', durationText),
                    ] else if (type == 'HIRE_DRIVER') ...[
                      _buildSummaryRow('Type', 'Hire Driver'),
                      _buildSummaryRow('Drivers Needed', detailsObj['driverCount']?.toString()),
                      _buildSummaryRow('Location', detailsObj['driverLocation']?.toString()),
                      _buildSummaryRow(
                        'Start Date & Time',
                        '${_formatDate(detailsObj['driverStartDate'])} ${detailsObj['driverStartTime'] ?? ''}'.trim(),
                      ),
                      _buildSummaryRow(
                        'End Date & Time',
                        '${_formatDate(detailsObj['driverEndDate'])} ${detailsObj['driverEndTime'] ?? ''}'.trim(),
                      ),
                      _buildSummaryRow(
                        'Tasks',
                        (detailsObj['driverTasks'] is List)
                            ? (detailsObj['driverTasks'] as List).join(', ').replaceAll('_', ' ')
                            : detailsObj['driverTasks']?.toString(),
                      ),
                      _buildSummaryRow(
                        'Requirements',
                        (detailsObj['driverRequirements'] is List)
                            ? (detailsObj['driverRequirements'] as List).join(', ').replaceAll('_', ' ')
                            : detailsObj['driverRequirements']?.toString(),
                      ),
                      _buildSummaryRow('Notes', detailsObj['driverTaskNotes']?.toString()),
                      _buildSummaryRow('Total Time Taken', durationText),
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
}
