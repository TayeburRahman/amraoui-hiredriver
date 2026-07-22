import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:Vehiqqo/widgets/cards/location_timeline_widget.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import 'cancel_mission_screen.dart';
import 'missions_screen.dart'; // To access MissionsController
import 'pickup_verification_screen.dart';
import 'multi_day_arrival_screen.dart';
import 'pickup_inspection_screen.dart' hide Gap;
import 'delivery_inspection_screen.dart' hide Gap;
import 'package:intl/intl.dart';
import 'package:Vehiqqo/const/api_url/api_url.dart';

class MissionDetailsScreen extends StatelessWidget {
  final Map<String, dynamic> mission;
  final String reqId;

  const MissionDetailsScreen({
    super.key,
    required this.mission,
    required this.reqId,
  });

  String _formatDate(String? dateStr) {
    if (dateStr == null || dateStr.trim().isEmpty) return '';
    try {
      final parsed = DateTime.parse(dateStr);
      return DateFormat('dd/MM/yyyy').format(parsed);
    } catch (_) {
      return dateStr;
    }
  }

  @override
  Widget build(BuildContext context) {
    final type = mission['type'];
    String title = 'Mission Details';
    if (type == 'TRANSPORT') title = 'Transport Mission Details';
    if (type == 'INSPECTION') title = 'Inspection Mission Details';
    if (type == 'HIRE_DRIVER') title = 'Driver Mission Details';

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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppText(
              data: title,
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF0F172A),
            ),
            AppText(
              data: reqId,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF2563EB),
            ),
          ],
        ),
        centerTitle: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: AppSize.width(value: 20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Gap(height: 16),
              _buildHeaderCard(),
              const Gap(height: 16),
              ..._buildDynamicDetails(),
              const Gap(height: 32),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomActions(),
    );
  }

  Widget _buildHeaderCard() {
    final detailsObj = mission['details'] ?? {};
    final type = mission['type'];
    final status = mission['status']?.toString() ?? 'Pending';
    String price = 'Pending';
    if (mission['adminQuote'] != null) {
      final driverPrice = mission['adminQuote']['driverPrice']?.toString();
      if (driverPrice != null &&
          driverPrice.isNotEmpty &&
          driverPrice != 'null') {
        price = '€$driverPrice';
      }
    }

    String pLocation = 'Unknown';
    String dLocation = 'Unknown';

    if (type == 'TRANSPORT') {
      pLocation = detailsObj['pickupCity']?.toString().isNotEmpty == true
          ? detailsObj['pickupCity']
          : (detailsObj['pickupAddress'] ?? 'Unknown');
      dLocation = detailsObj['dropoffCity']?.toString().isNotEmpty == true
          ? detailsObj['dropoffCity']
          : (detailsObj['dropoffAddress'] ?? 'Unknown');
    } else if (type == 'INSPECTION') {
      pLocation = detailsObj['inspectionLocation'] ?? 'Unknown Location';
      dLocation = detailsObj['inspectionDate'] != null
          ? '${_formatDate(detailsObj['inspectionDate'])} ${detailsObj['inspectionTime'] ?? ''}'
          : 'Unknown Date';
    } else if (type == 'HIRE_DRIVER') {
      pLocation = detailsObj['driverCity']?.toString().isNotEmpty == true
          ? detailsObj['driverCity']
          : (detailsObj['driverLocation'] ?? 'Unknown');
      dLocation =
          '${_formatDate(detailsObj['driverStartDate'])} to ${_formatDate(detailsObj['driverEndDate'])}';
    }

    String headerDateTime = 'N/A';
    if (type == 'TRANSPORT') {
      final pd = _formatDate(detailsObj['pickupDate']);
      final pt = detailsObj['pickupTime'] ?? '';
      headerDateTime = [pd, pt].where((s) => s.isNotEmpty).join(' ');
      if (headerDateTime.isEmpty) headerDateTime = 'N/A';
    } else if (type == 'INSPECTION') {
      final id = _formatDate(detailsObj['inspectionDate']);
      final it = detailsObj['inspectionTime'] ?? '';
      headerDateTime = [id, it].where((s) => s.isNotEmpty).join(' ');
      if (headerDateTime.isEmpty) headerDateTime = 'N/A';
    } else if (type == 'HIRE_DRIVER') {
      final sd = _formatDate(detailsObj['driverStartDate']);
      final st = detailsObj['driverStartTime'] ?? '';
      headerDateTime = [sd, st].where((s) => s.isNotEmpty).join(' ');
      if (headerDateTime.isEmpty) headerDateTime = 'N/A';
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LocationTimelineWidget(
            mission: mission,
            textColor: Colors.white,
            secondaryTextColor: Colors.white70,
          ),
          const Gap(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [_buildHeaderStat('Proposed Price', price)],
          ),
          const Gap(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildHeaderStat('Date & Time', headerDateTime),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const AppText(
                    data: 'Status',
                    fontSize: 12,
                    color: Colors.white70,
                  ),
                  const Gap(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: AppText(
                      data: status,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderStat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AppText(data: label, fontSize: 12, color: Colors.white70),
        const Gap(height: 4),
        AppText(
          data: value,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ],
    );
  }

  List<Widget> _buildDynamicDetails() {
    final type = mission['type'];
    final detailsObj = mission['details'] ?? {};
    List<Widget> widgets = [];

    // --- TRANSPORT ---
    if (type == 'TRANSPORT') {
      widgets.add(
        _buildSectionCard(
          title: 'Vehicle Details',
          icon: Icons.directions_car_outlined,
          content: Column(
            children: [
              _buildInfoRow(
                'Brand & Model',
                '${detailsObj['make'] ?? ''} ${detailsObj['model'] ?? ''}',
              ),
              if (detailsObj['vehicleType']?.toString().isNotEmpty == true)
                _buildInfoRow('Vehicle Type', detailsObj['vehicleType']),
              if (detailsObj['engineType']?.toString().isNotEmpty == true)
                _buildInfoRow('Engine Type', detailsObj['engineType']),
              if (detailsObj['plate']?.toString().isNotEmpty == true)
                _buildInfoRow('License Plate', detailsObj['plate']),
              if (detailsObj['vin']?.toString().isNotEmpty == true)
                _buildInfoRow('VIN', detailsObj['vin']),
              if (detailsObj['year']?.toString().isNotEmpty == true)
                _buildInfoRow('Year', detailsObj['year']),
              if (detailsObj['color']?.toString().isNotEmpty == true)
                _buildInfoRow('Color', detailsObj['color']),
              if (detailsObj['condition']?.toString().isNotEmpty == true)
                _buildInfoRow('Condition', detailsObj['condition']),
            ],
          ),
        ),
      );

      widgets.add(const Gap(height: 16));
      widgets.add(
        _buildSectionCard(
          title: 'Pickup Information',
          icon: Icons.location_on_outlined,
          content: Column(
            children: [
              _buildInfoRow(
                'Address',
                '${detailsObj['pickupAddress'] ?? ''} ${detailsObj['pickupCity'] ?? ''} ${detailsObj['pickupZip'] ?? ''}',
              ),
              _buildInfoRow(
                'Date & Time',
                '${_formatDate(detailsObj['pickupDate'])} ${detailsObj['pickupTime'] ?? ''}'
                    .trim(),
              ),
              _buildInfoRow(
                'Contact',
                '${detailsObj['pickupContactName'] ?? ''}',
              ),
              if (detailsObj['company']?.toString().isNotEmpty == true)
                _buildInfoRow('Company', detailsObj['company']),
              if (detailsObj['pickupContactPhone']?.toString().isNotEmpty ==
                  true)
                _buildInfoRow('Phone', detailsObj['pickupContactPhone']),
            ],
          ),
        ),
      );

      widgets.add(const Gap(height: 16));
      widgets.add(
        _buildSectionCard(
          title: 'Delivery Information',
          icon: Icons.flag_outlined,
          content: Column(
            children: [
              _buildInfoRow(
                'Address',
                '${detailsObj['dropoffAddress'] ?? ''} ${detailsObj['dropoffCity'] ?? ''} ${detailsObj['dropoffZip'] ?? ''}',
              ),
              _buildInfoRow(
                'Date & Time',
                '${_formatDate(detailsObj['dropoffDate'])} ${detailsObj['dropoffTime'] ?? ''}'
                    .trim(),
              ),
              _buildInfoRow(
                'Contact',
                '${detailsObj['dropoffContactName'] ?? ''}',
              ),
              if (detailsObj['dropoffContactPhone']?.toString().isNotEmpty ==
                  true)
                _buildInfoRow('Phone', detailsObj['dropoffContactPhone']),
              if (detailsObj['dropoffCompany']?.toString().isNotEmpty == true)
                _buildInfoRow('Company', detailsObj['dropoffCompany']),
              if (detailsObj['dropoffInstructions']?.toString().isNotEmpty ==
                  true)
                _buildInfoRow(
                  'Instructions',
                  detailsObj['dropoffInstructions'],
                ),
            ],
          ),
        ),
      );

      widgets.add(const Gap(height: 16));
      widgets.add(
        _buildSectionCard(
          title: 'Service & Options',
          icon: Icons.settings_outlined,
          content: Column(
            children: [
              _buildInfoRow(
                'Delivery Type',
                (detailsObj['deliveryType']?.toString().toLowerCase() == 'tow')
                    ? 'Vehicle Carrier'
                    : (detailsObj['deliveryType'] ?? ''),
              ),
              if (detailsObj['specialInstructions']?.toString().isNotEmpty ==
                  true)
                _buildInfoRow(
                  'Special Instructions',
                  detailsObj['specialInstructions'],
                ),
              if (detailsObj['deliveryConditions'] != null &&
                  detailsObj['deliveryConditions'] is List)
                _buildInfoRow(
                  'Conditions',
                  (detailsObj['deliveryConditions'] as List).join(', '),
                ),
            ],
          ),
        ),
      );

      widgets.add(const Gap(height: 16));
      widgets.add(
        _buildSectionCard(
          title: 'Mission Steps',
          icon: Icons.format_list_numbered_outlined,
          content: Column(
            children: [
              _buildMissionStep(1, 'Preparing for departure'),
              const Gap(height: 12),
              _buildMissionStep(2, 'Vehicle inventory on pickup'),
              const Gap(height: 12),
              _buildMissionStep(3, 'Carrying out the mission'),
              const Gap(height: 12),
              _buildMissionStep(4, 'Vehicle inventory on delivery'),
            ],
          ),
        ),
      );
    }
    // --- INSPECTION ---
    else if (type == 'INSPECTION') {
      widgets.add(
        _buildSectionCard(
          title: 'Vehicle Details',
          icon: Icons.directions_car_outlined,
          content: Column(
            children: [
              _buildInfoRow(
                'Brand & Model',
                '${detailsObj['vehicleBrand'] ?? ''} ${detailsObj['vehicleModel'] ?? ''}',
              ),
              if (detailsObj['licensePlate']?.toString().isNotEmpty == true)
                _buildInfoRow('License Plate', detailsObj['licensePlate']),
              if (detailsObj['vinNumber']?.toString().isNotEmpty == true)
                _buildInfoRow('VIN', detailsObj['vinNumber']),
            ],
          ),
        ),
      );

      widgets.add(const Gap(height: 16));
      widgets.add(
        _buildSectionCard(
          title: 'Inspection Details',
          icon: Icons.search_outlined,
          content: Column(
            children: [
              _buildInfoRow('Type', detailsObj['inspectionType'] ?? ''),
              _buildInfoRow('Location', detailsObj['inspectionLocation'] ?? ''),
              _buildInfoRow(
                'Date & Time',
                '${_formatDate(detailsObj['inspectionDate'])} ${detailsObj['inspectionTime'] ?? ''}'
                    .trim(),
              ),
              if (detailsObj['inspectionNotes']?.toString().isNotEmpty == true)
                _buildInfoRow('Notes', detailsObj['inspectionNotes']),
            ],
          ),
        ),
      );

      widgets.add(const Gap(height: 16));
      final customerPhone = detailsObj['customerPhone']?.toString() ?? '';
      widgets.add(
        _buildContactCard(
          title: 'Customer Information',
          name: detailsObj['customerName'] ?? 'Unknown Customer',
          phone: customerPhone,
          companyName:
              mission['customerId']?['company']?.toString() ??
              mission['customerId']?['company_name']?.toString() ??
              detailsObj['companyName']?.toString() ??
              (detailsObj['company']?.toString().contains(',') == true ? null : detailsObj['company']?.toString()),
        ),
      );
    }
    // --- HIRE DRIVER ---
    else if (type == 'HIRE_DRIVER') {
      widgets.add(
        _buildSectionCard(
          title: 'Driver Mission Details',
          icon: Icons.person_pin_circle_outlined,
          content: Column(
            children: [
              _buildInfoRow(
                'Location',
                '${detailsObj['driverLocation'] ?? ''} ${detailsObj['driverCity'] ?? ''} ${detailsObj['driverPostalCode'] ?? ''}',
              ),
              _buildInfoRow(
                'Drivers Needed',
                detailsObj['driverCount']?.toString() ?? '1',
              ),
              _buildInfoRow(
                'Start',
                '${_formatDate(detailsObj['driverStartDate'])} ${detailsObj['driverStartTime'] ?? ''}'
                    .trim(),
              ),
              _buildInfoRow(
                'End',
                '${_formatDate(detailsObj['driverEndDate'])} ${detailsObj['driverEndTime'] ?? ''}'
                    .trim(),
              ),
              if (detailsObj['driverTasks'] != null &&
                  detailsObj['driverTasks'] is List)
                _buildInfoRow(
                  'Tasks',
                  (detailsObj['driverTasks'] as List)
                      .join(', ')
                      .replaceAll('_', ' '),
                ),
              if (detailsObj['driverTaskNotes']?.toString().isNotEmpty == true)
                _buildInfoRow('Task Notes', detailsObj['driverTaskNotes']),
              if (detailsObj['driverLocationNote']?.toString().isNotEmpty ==
                  true)
                _buildInfoRow(
                  'Location Notes',
                  detailsObj['driverLocationNote'],
                ),
            ],
          ),
        ),
      );
    }

    // Default Customer details if not inspection (Inspection already has details mapped)
    if (type != 'INSPECTION') {
      final customer = mission['customerId'] ?? {};
      final companyName =
          customer['company']?.toString() ??
          customer['company_name']?.toString() ??
          detailsObj['companyName']?.toString() ??
          (detailsObj['company']?.toString().contains(',') == true ? null : detailsObj['company']?.toString());

      final String fallbackName =
          (type == 'TRANSPORT' && detailsObj['firstName'] != null)
          ? '${detailsObj['firstName']} ${detailsObj['lastName'] ?? ''}'.trim()
          : customer['name']?.toString() ?? 'Unknown Customer';
      final String fallbackPhone =
          (type == 'TRANSPORT' && detailsObj['phone'] != null)
          ? detailsObj['phone']
          : customer['phone_number']?.toString() ?? '';

      if (type == 'TRANSPORT') {
        final pickupName =
            detailsObj['pickupContactName']?.toString().isNotEmpty == true
            ? detailsObj['pickupContactName']
            : fallbackName;
        final pickupPhone =
            detailsObj['pickupContactPhone']?.toString().isNotEmpty == true
            ? detailsObj['pickupContactPhone']
            : fallbackPhone;

        final dropoffName =
            detailsObj['dropoffContactName']?.toString().isNotEmpty == true
            ? detailsObj['dropoffContactName']
            : fallbackName;
        final dropoffPhone =
            detailsObj['dropoffContactPhone']?.toString().isNotEmpty == true
            ? detailsObj['dropoffContactPhone']
            : fallbackPhone;

        widgets.add(const Gap(height: 16));
        widgets.add(
          _buildContactCard(
            title: 'Pickup Contact',
            name: pickupName,
            phone: pickupPhone,
            companyName: companyName,
          ),
        );

        widgets.add(const Gap(height: 16));
        widgets.add(
          _buildContactCard(
            title: 'Delivery Contact',
            name: dropoffName,
            phone: dropoffPhone,
            companyName: companyName,
          ),
        );
      } else {
        widgets.add(const Gap(height: 16));
        widgets.add(
          _buildContactCard(
            title: 'Customer Information',
            name: fallbackName,
            phone: fallbackPhone,
            companyName: companyName,
          ),
        );
      }
    }

    if (detailsObj['documents'] != null &&
        detailsObj['documents'] is List &&
        (detailsObj['documents'] as List).isNotEmpty) {
      widgets.add(const Gap(height: 16));
      widgets.add(
        _buildSectionCard(
          title: 'Attached Documents',
          icon: Icons.attach_file,
          content: Column(
            children: (detailsObj['documents'] as List)
                .map((doc) => _buildDocumentRow(doc.toString()))
                .toList(),
          ),
        ),
      );
    }

    return widgets;
  }

  Widget _buildDocumentRow(String docUrl) {
    final fileName = docUrl.split('/').last;
    final fullUrl = docUrl.startsWith('http')
        ? docUrl
        : '${AppApiUrl.domain}${docUrl.startsWith('/') ? '' : '/'}$docUrl';
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                const Icon(
                  Icons.description,
                  size: 20,
                  color: Color(0xFF2563EB),
                ),
                const Gap(width: 8),
                Expanded(
                  child: AppText(
                    data: fileName,
                    fontSize: 13,
                    color: const Color(0xFF334155),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(
              Icons.download,
              size: 20,
              color: Color(0xFF64748B),
            ),
            onPressed: () async {
              final uri = Uri.parse(fullUrl);
              try {
                final launched = await launchUrl(
                  uri,
                  mode: LaunchMode.externalApplication,
                );
                if (!launched) {
                  Get.snackbar('Error', 'Could not open document link');
                }
              } catch (e) {
                Get.snackbar('Error', 'Could not open document link');
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard({
    required String title,
    required String name,
    required String phone,
    String? companyName,
  }) {
    return _buildSectionCard(
      title: title,
      icon: Icons.person_outline,
      content: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (companyName != null && companyName.isNotEmpty) ...[
                  AppText(
                    data: companyName,
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: const Color(
                      0xFF2563EB,
                    ), // Using the blue accent color
                  ),
                  const Gap(height: 2),
                ],
                AppText(
                  data: name,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF0F172A),
                ),
                const Gap(height: 4),
                if (phone.isNotEmpty)
                  AppText(
                    data: phone,
                    fontSize: 13,
                    color: const Color(0xFF64748B),
                  ),
              ],
            ),
          ),
          if (phone.isNotEmpty)
            GestureDetector(
              onTap: () async {
                final Uri url = Uri.parse('tel:${phone.replaceAll(" ", "")}');
                try {
                  final launched = await launchUrl(url);
                  if (!launched) {
                    Get.snackbar('Error', 'Could not launch dialer');
                  }
                } catch (e) {
                  Get.snackbar('Error', 'Could not launch dialer');
                }
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: Color(0xFF06B6D4),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.phone, color: Colors.white, size: 20),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Widget content,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF2563EB), size: 20),
              const Gap(width: 8),
              AppText(
                data: title,
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF0F172A),
              ),
            ],
          ),
          const Gap(height: 16),
          content,
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          AppText(data: label, fontSize: 13, color: const Color(0xFF64748B)),
          Expanded(
            child: AppText(
              data: value,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF0F172A),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMissionStep(int number, String text) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: Color(0xFFE2E8F0),
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: AppText(
            data: number.toString(),
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF475569),
          ),
        ),
        const Gap(width: 12),
        Expanded(
          child: AppText(
            data: text,
            fontSize: 14,
            color: const Color(0xFF334155),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomActions() {
    final status = mission['status'];
    final type = mission['type'];

    if (status == 'IN_PROGRESS') {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
        ),
        child: SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF06B6D4),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            onPressed: () {
              final details = mission['details'] ?? {};
              final verification = details['pickupVerification'];
              final bool isVerified =
                  verification != null &&
                  verification['arrivalDeclared'] == true;

              if (type == 'INSPECTION') {
                if (isVerified) {
                  Get.to(
                    () => DeliveryInspectionScreen(
                      mission: mission,
                      reqId: reqId,
                    ),
                  );
                } else {
                  Get.to(
                    () => PickupVerificationScreen(
                      mission: mission,
                      reqId: reqId,
                    ),
                  );
                }
              } else if (type == 'HIRE_DRIVER') {
                Get.to(
                  () => MultiDayArrivalScreen(mission: mission, reqId: reqId),
                );
              } else {
                // TRANSPORT
                if (isVerified &&
                    verification['vehicleMatchConfirmed'] == true) {
                  Get.to(
                    () =>
                        PickupInspectionScreen(mission: mission, reqId: reqId),
                  );
                } else {
                  Get.to(
                    () => PickupVerificationScreen(
                      mission: mission,
                      reqId: reqId,
                    ),
                  );
                }
              }
            },
            child: const AppText(
              data: 'Continue Mission',
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
        ),
      );
    }

    if (status != 'ASSIGNED') return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: const Color(0xFFE2E8F0))),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: double.infinity,
            height: 50,
            child: Obx(() {
              final controller = Get.find<MissionsController>();
              return ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF06B6D4),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                onPressed: controller.isStartingMission.value
                    ? null
                    : () async {
                        final success = await controller.startMission(
                          mission['_id'],
                        );
                        if (success) {
                          Get.back();
                          Get.snackbar(
                            'Success',
                            'Mission started successfully!',
                            backgroundColor: const Color(0xFF10B981),
                            colorText: Colors.white,
                            snackPosition: SnackPosition.bottom,
                            margin: const EdgeInsets.all(16),
                          );
                        } else {
                          Get.snackbar(
                            'Error',
                            'Failed to start mission',
                            backgroundColor: const Color(0xFFEF4444),
                            colorText: Colors.white,
                            snackPosition: SnackPosition.bottom,
                            margin: const EdgeInsets.all(16),
                          );
                        }
                      },
                child: controller.isStartingMission.value
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const AppText(
                        data: 'Start Mission',
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
              );
            }),
          ),
          const Gap(height: 12),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFFE2E8F0)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                Get.to(
                  () => CancelMissionScreen(mission: mission, reqId: reqId),
                );
              },
              child: const AppText(
                data: 'Cancel Mission',
                color: Color(0xFF64748B),
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
