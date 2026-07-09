import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

String _getFlagEmoji(String? addressOrCountry) {
  if (addressOrCountry == null || addressOrCountry.isEmpty) return '🇧🇪';
  final lower = addressOrCountry.toLowerCase();

  final Map<String, String> countryMap = {
    'belgi': '🇧🇪',
    'france': '🇫🇷',
    'franc': '🇫🇷',
    'frankreich': '🇫🇷',
    'netherland': '🇳🇱',
    'nederland': '🇳🇱',
    'holland': '🇳🇱',
    'pays-bas': '🇳🇱',
    'germany': '🇩🇪',
    'deutschland': '🇩🇪',
    'allemagne': '🇩🇪',
    'luxemb': '🇱🇺',
    'ital': '🇮🇹',
    'spain': '🇪🇸',
    'espa': '🇪🇸',
    'spanien': '🇪🇸',
    'switz': '🇨🇭',
    'suisse': '🇨🇭',
    'schweiz': '🇨🇭',
    'svizzera': '🇨🇭',
    'uk ': '🇬🇧',
    'united kingdom': '🇬🇧',
    'england': '🇬🇧',
    'royaume-uni': '🇬🇧',
    'austri': '🇦🇹',
    'österreich': '🇦🇹',
    'autriche': '🇦🇹',
    'poland': '🇵🇱',
    'polska': '🇵🇱',
    'pologne': '🇵🇱',
    'portugal': '🇵🇹',
    'sweden': '🇸🇪',
    'sverige': '🇸🇪',
    'suède': '🇸🇪',
    'norway': '🇳🇴',
    'norge': '🇳🇴',
    'norvège': '🇳🇴',
    'denmark': '🇩🇰',
    'danmark': '🇩🇰',
    'danemark': '🇩🇰',
    'finland': '🇫🇮',
    'suomi': '🇫🇮',
    'finlande': '🇫🇮',
    'ireland': '🇮🇪',
    'irlande': '🇮🇪',
    'greece': '🇬🇷',
    'hellas': '🇬🇷',
    'czech': '🇨🇿',
    'česk': '🇨🇿',
    'tchéquie': '🇨🇿',
    'hungar': '🇭🇺',
    'magyar': '🇭🇺',
    'hongrie': '🇭🇺',
    'romania': '🇷🇴',
    'românia': '🇷🇴',
    'roumanie': '🇷🇴',
    'bulgaria': '🇧🇬',
    'bulgarie': '🇧🇬',
    'croatia': '🇭🇷',
    'hrvatska': '🇭🇷',
    'slovakia': '🇸🇰',
    'slovensko': '🇸🇰',
    'slovenia': '🇸🇮',
    'slovenija': '🇸🇮',
    'usa': '🇺🇸',
    'united states': '🇺🇸',
    'états-unis': '🇺🇸',
    'canada': '🇨🇦',
    'bangladesh': '🇧🇩',
    'india': '🇮🇳',
  };

  for (final entry in countryMap.entries) {
    if (lower.contains(entry.key)) return entry.value;
  }
  return '🇧🇪';
}

String _formatDateDDMMYYYY(String dateStr) {
  if (dateStr.isEmpty) return '';
  try {
    final parts = dateStr.split('-');
    if (parts.length == 3 && parts[0].length == 4) {
      return '${parts[2]}/${parts[1]}/${parts[0]}';
    }
  } catch (_) {}
  return dateStr;
}

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
      final pickupDate = _formatDateDDMMYYYY(d['pickupDate']?.toString() ?? '');
      final pickupTime = d['pickupTime']?.toString() ?? '';
      final pDateTime = [
        pickupDate,
        pickupTime,
      ].where((s) => s.isNotEmpty).join(' - ');

      final pCity = d['pickupCity']?.toString() ?? '';
      final pZip = d['pickupZip']?.toString() ?? '';
      final pAddress = d['pickupAddress']?.toString() ?? '';
      final pCountry = d['pickupCountry']?.toString() ?? pAddress;

      final pickupFullTitle = pCity.isNotEmpty
          ? '${_getFlagEmoji(pCountry)} ${pZip.isNotEmpty ? '$pZip ' : ''}$pCity'
          : (pAddress.isNotEmpty ? '${_getFlagEmoji(pAddress)} $pAddress' : 'Pending Location');

      final dropoffDate = _formatDateDDMMYYYY(
        d['dropoffDate']?.toString() ?? '',
      );
      final dropoffTime = d['dropoffTime']?.toString() ?? '';
      final dDateTime = [
        dropoffDate,
        dropoffTime,
      ].where((s) => s.isNotEmpty).join(' - ');

      final dCity = d['dropoffCity']?.toString() ?? '';
      final dZip = d['dropoffZip']?.toString() ?? '';
      final dAddress = d['dropoffAddress']?.toString() ?? '';
      final dCountry = d['dropoffCountry']?.toString() ?? dAddress;

      final dropoffFullTitle = dCity.isNotEmpty
          ? '${_getFlagEmoji(dCountry)} ${dZip.isNotEmpty ? '$dZip ' : ''}$dCity'
          : (dAddress.isNotEmpty ? '${_getFlagEmoji(dAddress)} $dAddress' : 'Pending Location');

      final customerName =
          mission['customerId']?['name']?.toString() ?? 'Customer';
      final distance =
          d['distance']?.toString() ??
          (mission['distance']?.toString() ?? 'N/A km');

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTimelineItem(
            isFirst: true,
            isLast: false,
            title: pickupFullTitle,
            subtitle: pDateTime.isNotEmpty ? pDateTime : 'Pickup',
            iconColor: const Color(0xFF2563EB),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 4.0, bottom: 8.0),
            child: Row(
              children: [
                Container(
                  width: 2,
                  height: 24,
                  color: const Color(0xFFE2E8F0),
                  margin: const EdgeInsets.only(left: 3, right: 26),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: AppText(
                    data: '$distance • $customerName',
                    fontSize: 12,
                    color: const Color(0xFF64748B),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          _buildTimelineItem(
            isFirst: false,
            isLast: true,
            title: dropoffFullTitle,
            subtitle: dDateTime.isNotEmpty ? dDateTime : 'Dropoff',
            iconColor: const Color(0xFF06B6D4),
          ),
        ],
      );
    } else if (type == 'INSPECTION') {
      final iDate = _formatDateDDMMYYYY(d['inspectionDate']?.toString() ?? '');
      final iTime = d['inspectionTime']?.toString() ?? '';
      final iDateTime = [iDate, iTime].where((s) => s.isNotEmpty).join(' - ');

      final iCity = d['inspectionCity']?.toString() ?? '';
      final iZip = d['inspectionZip']?.toString() ?? '';
      final locationFull = d['inspectionLocation']?.toString() ?? '';
      final iCountry = d['inspectionCountry']?.toString() ?? locationFull;

      final inspectionFullTitle = iCity.isNotEmpty
          ? '${_getFlagEmoji(iCountry)} ${iZip.isNotEmpty ? '$iZip ' : ''}$iCity'
          : (locationFull.isNotEmpty ? '${_getFlagEmoji(locationFull)} $locationFull' : 'Pending Location');

      final destCity = d['destinationCity']?.toString() ?? '';
      final destZip = d['destinationZip']?.toString() ?? '';
      final destAddress = d['destinationAddress']?.toString() ?? '';
      final destCountry = d['destinationCountry']?.toString() ?? destAddress;

      final destFullTitle = destCity.isNotEmpty
          ? '${_getFlagEmoji(destCountry)} ${destZip.isNotEmpty ? '$destZip ' : ''}$destCity'
          : (destAddress.isNotEmpty ? '${_getFlagEmoji(destAddress)} $destAddress' : '');

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTimelineItem(
            isFirst: true,
            isLast: destFullTitle.isEmpty,
            title: inspectionFullTitle,
            subtitle: iDateTime.isNotEmpty ? iDateTime : 'Inspection',
            iconColor: const Color(0xFF2563EB),
          ),
          if (destFullTitle.isNotEmpty)
            _buildTimelineItem(
              isFirst: false,
              isLast: true,
              title: destFullTitle,
              subtitle: 'Destination',
              iconColor: const Color(0xFF06B6D4),
            ),
        ],
      );
    } else if (type == 'HIRE_DRIVER') {
      final startDate = _formatDateDDMMYYYY(
        d['driverStartDate']?.toString() ?? '',
      );
      final startTime = d['driverStartTime']?.toString() ?? '';
      final endDate = _formatDateDDMMYYYY(d['driverEndDate']?.toString() ?? '');
      final endTime = d['driverEndTime']?.toString() ?? '';

      String combinedTime = '';
      if (startDate == endDate) {
        if (startTime.isNotEmpty && endTime.isNotEmpty) {
          combinedTime = '$startDate, $startTime - $endTime';
        } else {
          combinedTime = startDate;
        }
      } else {
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

      final city = d['driverCity']?.toString() ?? '';
      final locationFull = d['driverLocation']?.toString() ?? '';
      final title = city.isNotEmpty
          ? '${_getFlagEmoji(locationFull)} $city'
          : '${_getFlagEmoji(locationFull)} $locationFull';

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTimelineItem(
            isFirst: true,
            isLast: true,
            title: title.isNotEmpty && title != '🇧🇪 '
                ? title
                : 'Pending Location',
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
