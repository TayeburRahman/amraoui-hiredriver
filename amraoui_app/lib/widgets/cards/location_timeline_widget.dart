import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

class LocationTimelineWidget extends StatelessWidget {
  final Map<String, dynamic> mission;
  final Color textColor;
  final Color secondaryTextColor;

  const LocationTimelineWidget({
    Key? key,
    required this.mission,
    this.textColor = const Color(0xFF0F172A),
    this.secondaryTextColor = const Color(0xFF64748B),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final type = mission['type'];
    final d = mission['details'] ?? {};

    if (type == 'TRANSPORT') {
      final pickupDate = d['pickupDate']?.toString() ?? '';
      final pickupTime = d['pickupTime']?.toString() ?? '';
      final pDateTime = [
        pickupDate,
        pickupTime,
      ].where((s) => s.isNotEmpty).join(' - ');

      final pAddress = d['pickupAddress']?.toString() ?? '';
      final pCity = d['pickupCity']?.toString() ?? '';
      final pZip = d['pickupZip']?.toString() ?? '';
      final pickupFullAddress = [
        pAddress,
        pCity,
        pZip,
      ].where((s) => s.isNotEmpty && s != 'null').join(', ');

      final dropoffDate = d['dropoffDate']?.toString() ?? '';
      final dropoffTime = d['dropoffTime']?.toString() ?? '';
      final dDateTime = [
        dropoffDate,
        dropoffTime,
      ].where((s) => s.isNotEmpty).join(' - ');

      final dAddress = d['dropoffAddress']?.toString() ?? '';
      final dCity = d['dropoffCity']?.toString() ?? '';
      final dZip = d['dropoffZip']?.toString() ?? '';
      final dropoffFullAddress = [
        dAddress,
        dCity,
        dZip,
      ].where((s) => s.isNotEmpty && s != 'null').join(', ');

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTimelineItem(
            isFirst: true,
            isLast: false,
            title: pickupFullAddress.isNotEmpty
                ? pickupFullAddress
                : 'Pending Location',
            subtitle: pDateTime.isNotEmpty ? pDateTime : 'Pickup',
            iconColor: const Color(0xFF2563EB),
          ),
          _buildTimelineItem(
            isFirst: false,
            isLast: true,
            title: dropoffFullAddress.isNotEmpty
                ? dropoffFullAddress
                : 'Pending Location',
            subtitle: dDateTime.isNotEmpty ? dDateTime : 'Dropoff',
            iconColor: const Color(0xFF06B6D4),
          ),
        ],
      );
    } else if (type == 'INSPECTION') {
      final iDate = d['inspectionDate']?.toString() ?? '';
      final iTime = d['inspectionTime']?.toString() ?? '';
      final iDateTime = [iDate, iTime].where((s) => s.isNotEmpty).join(' - ');

      final iLocation = d['inspectionLocation']?.toString() ?? '';
      final iCity = d['inspectionCity']?.toString() ?? '';
      final iZip = d['inspectionZip']?.toString() ?? '';
      final inspectionFullAddress = [
        iLocation,
        iCity,
        iZip,
      ].where((s) => s.isNotEmpty && s != 'null').join(', ');

      final destAddress = d['destinationAddress']?.toString() ?? '';
      final destCity = d['destinationCity']?.toString() ?? '';
      final destZip = d['destinationZip']?.toString() ?? '';
      final destFullAddress = [
        destAddress,
        destCity,
        destZip,
      ].where((s) => s.isNotEmpty && s != 'null').join(', ');

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTimelineItem(
            isFirst: true,
            isLast: destFullAddress.isEmpty,
            title: inspectionFullAddress.isNotEmpty
                ? inspectionFullAddress
                : 'Pending Location',
            subtitle: iDateTime.isNotEmpty ? iDateTime : 'Inspection',
            iconColor: const Color(0xFF2563EB),
          ),
          if (destFullAddress.isNotEmpty)
            _buildTimelineItem(
              isFirst: false,
              isLast: true,
              title: destFullAddress,
              subtitle: 'Destination',
              iconColor: const Color(0xFF06B6D4),
            ),
        ],
      );
    } else if (type == 'HIRE_DRIVER') {
      final startDate = d['driverStartDate']?.toString() ?? '';
      final startTime = d['driverStartTime']?.toString() ?? '';
      final endDate = d['driverEndDate']?.toString() ?? '';
      final endTime = d['driverEndTime']?.toString() ?? '';

      String combinedTime = '';
      if (startDate == endDate) {
        // Same date
        if (startTime.isNotEmpty && endTime.isNotEmpty) {
          combinedTime = '$startDate, $startTime - $endTime';
        } else {
          combinedTime = startDate;
        }
      } else {
        // Different dates
        final startStr = [
          startDate,
          startTime,
        ].where((s) => s.isNotEmpty).join(' ');
        final endStr = [endDate, endTime].where((s) => s.isNotEmpty).join(' ');
        if (startStr.isNotEmpty && endStr.isNotEmpty) {
          combinedTime = '$startStr to $endStr';
        } else if (startStr.isNotEmpty) {
          combinedTime = startStr;
        } else {
          combinedTime = endStr;
        }
      }

      final location =
          d['driverLocation']?.toString() ??
          d['driverCity']?.toString() ??
          'Pending Location';

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTimelineItem(
            isFirst: true,
            isLast: true,
            title: location,
            subtitle: combinedTime.isNotEmpty ? combinedTime : 'Hire Driver',
            iconColor: const Color(0xFF2563EB),
          ),
        ],
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildTimelineItem({
    required bool isFirst,
    required bool isLast,
    required String title,
    required String subtitle,
    required Color iconColor,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                margin: const EdgeInsets.only(top: 4),
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: iconColor, width: 3),
                  shape: BoxShape.circle,
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: const Color(0xFFE2E8F0),
                    margin: const EdgeInsets.symmetric(vertical: 4),
                  ),
                ),
            ],
          ),
          const Gap(width: 16),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppText(
                    data: title,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: textColor,
                  ),
                  const Gap(height: 4),
                  AppText(
                    data: subtitle,
                    fontSize: 13,
                    color: secondaryTextColor,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
