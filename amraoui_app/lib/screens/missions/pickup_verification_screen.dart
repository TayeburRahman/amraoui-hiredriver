import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:Vehiqqo/service/repository/mission_repository.dart';
import 'pickup_inspection_screen.dart';
import 'delivery_inspection_screen.dart';
import 'package:Vehiqqo/utils/location_helper.dart';

class PickupVerificationScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;

  const PickupVerificationScreen({
    super.key,
    required this.mission,
    required this.reqId,
  });

  @override
  State<PickupVerificationScreen> createState() =>
      _PickupVerificationScreenState();
}

class _PickupVerificationScreenState extends State<PickupVerificationScreen> {
  bool arrivalDeclared = false;
  bool vehicleMatchConfirmed = false;
  LatLng? driverLocation;
  bool isLoadingLocation = true;
  double? distanceToPickup;
  bool isCalculatingDistance = false;

  @override
  void initState() {
    super.initState();
    final type = widget.mission['type'];
    final details = widget.mission['details'] ?? {};
    final verification = details['pickupVerification'];

    if (type != 'TRANSPORT') {
      vehicleMatchConfirmed = true;
    }

    if (verification != null) {
      arrivalDeclared = verification['arrivalDeclared'] == true;
      if (type == 'TRANSPORT') {
        vehicleMatchConfirmed = verification['vehicleMatchConfirmed'] == true;
      }
    }
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
        });

        // Calculate distance to pickup
        setState(() => isCalculatingDistance = true);
        final type = widget.mission['type'];
        final details = widget.mission['details'] ?? {};
        String pLocation = '';
        if (type == 'INSPECTION') {
          pLocation = details['inspectionLocation'] ?? '';
        } else if (type == 'HIRE_DRIVER') {
          pLocation = details['driverLocation'] ?? details['driverCity'] ?? '';
        } else {
          final pAddress = details['pickupAddress']?.toString() ?? '';
          final pZip = details['pickupZip']?.toString() ?? '';
          final pCity = details['pickupCity']?.toString() ?? '';
          final pCountry = details['pickupCountry']?.toString() ?? '';
          pLocation = [
            pAddress,
            pZip,
            pCity,
            pCountry,
          ].where((e) => e.isNotEmpty).join(', ');
        }

        if (pLocation.isNotEmpty) {
          final targetLatLng = await LocationHelper.geocodeAddress(pLocation);
          if (targetLatLng != null && driverLocation != null) {
            if (mounted) {
              setState(() {
                distanceToPickup = LocationHelper.calculateDistanceInMeters(
                  driverLocation!,
                  targetLatLng,
                );
              });
            }
          }
        }

        if (mounted) {
          setState(() {
            isLoadingLocation = false;
            isCalculatingDistance = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => isLoadingLocation = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final type = widget.mission['type'];
    final details = widget.mission['details'] ?? {};
    final customer = widget.mission['customerId'] ?? {};

    String pLocation = 'Unknown Location';
    String pDate = '';
    String pTime = '';
    String titleText = 'Pickup Verification';
    String locTitleText = 'Pickup Location';

    if (type == 'INSPECTION') {
      pLocation = details['inspectionLocation'] ?? 'Unknown Location';
      pDate = details['inspectionDate'] ?? '';
      pTime = details['inspectionTime'] ?? '';
      titleText = 'Arrival Declaration';
      locTitleText = 'Inspection Location';
    } else if (type == 'HIRE_DRIVER') {
      pLocation =
          details['driverLocation'] ??
          details['driverCity'] ??
          'Unknown Location';
      pDate = details['driverStartDate'] ?? '';
      pTime = details['driverStartTime'] ?? '';
      titleText = 'Client Arrival Declaration';
      locTitleText = 'Client Location';
    } else {
      pLocation =
          details['pickupAddress'] ??
          details['pickupCity'] ??
          'Unknown Location';
      pDate = details['pickupDate'] ?? '';
      pTime = details['pickupTime'] ?? '';
    }

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
              AppText(
                data: titleText,
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF0F172A),
              ),
              const Gap(height: 4),
              AppText(
                data: 'Mission ID: ${widget.reqId}',
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF64748B),
              ),
              const Gap(height: 24),

              // Pickup Location Card
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
                        AppText(
                          data: locTitleText,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF0F172A),
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
                    const Gap(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const AppText(
                          data: 'Expected Arrival',
                          fontSize: 13,
                          color: Color(0xFF64748B),
                        ),
                        AppText(
                          data: pTime,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF0F172A),
                        ),
                      ],
                    ),
                    const Gap(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        AppText(
                          data: 'Declared Arrival',
                          fontSize: 13,
                          color:
                              (arrivalDeclared &&
                                  distanceToPickup != null &&
                                  distanceToPickup! > 100)
                              ? Colors.red
                              : const Color(0xFF64748B),
                        ),
                        AppText(
                          data: arrivalDeclared
                              ? TimeOfDay.now().format(context)
                              : '--:--',
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color:
                              (arrivalDeclared &&
                                  distanceToPickup != null &&
                                  distanceToPickup! > 100)
                              ? Colors.red
                              : const Color(0xFF0F172A),
                        ),
                      ],
                    ),
                    if (arrivalDeclared &&
                        distanceToPickup != null &&
                        distanceToPickup! > 100) ...[
                      const Gap(height: 8),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red.shade200),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.warning_amber_rounded,
                              color: Colors.red.shade600,
                              size: 20,
                            ),
                            const Gap(width: 8),
                            Expanded(
                              child: AppText(
                                data:
                                    'Warning: You are ${(distanceToPickup! / 1000).toStringAsFixed(1)} km away from the expected location.',
                                fontSize: 12,
                                color: Colors.red.shade700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
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
                    const Gap(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: arrivalDeclared
                              ? const Color(0xFF10B981)
                              : const Color(0xFF06B6D4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        onPressed: () {
                          if (!arrivalDeclared) {
                            setState(() {
                              arrivalDeclared = true;
                            });
                            Get.snackbar(
                              'Arrival Declared',
                              'Notifications sent to Admin and Customer',
                              backgroundColor: const Color(0xFF10B981),
                              colorText: Colors.white,
                              snackPosition: SnackPosition.bottom,
                              margin: const EdgeInsets.all(16),
                            );
                          }
                        },
                        child: AppText(
                          data: arrivalDeclared
                              ? 'Arrival Declared'
                              : 'Declare Arrival / Verify Pin',
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const Gap(height: 16),

              // Vehicle Registration Card
              if (type == 'TRANSPORT') ...[
                _buildCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.directions_car_outlined,
                            color: Color(0xFF3B82F6),
                            size: 20,
                          ),
                          const Gap(width: 8),
                          const AppText(
                            data: 'Vehicle Registration',
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                        ],
                      ),
                      const Gap(height: 16),
                      const AppText(
                        data: 'License Plate',
                        fontSize: 12,
                        color: Color(0xFF64748B),
                      ),
                      AppText(
                        data: details['plate'] ?? 'N/A',
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF0F172A),
                      ),
                      const Gap(height: 12),
                      const AppText(
                        data: 'VIN / Chassis Number',
                        fontSize: 12,
                        color: Color(0xFF64748B),
                      ),
                      AppText(
                        data: details['vin'] ?? 'N/A',
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF0F172A),
                      ),
                      const Gap(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: vehicleMatchConfirmed
                                ? const Color(0xFF10B981)
                                : const Color(0xFF06B6D4),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 0,
                          ),
                          onPressed: () {
                            if (!vehicleMatchConfirmed) {
                              setState(() {
                                vehicleMatchConfirmed = true;
                              });
                              Get.snackbar(
                                'Vehicle Confirmed',
                                'Vehicle details successfully matched and received.',
                                backgroundColor: const Color(0xFF10B981),
                                colorText: Colors.white,
                                snackPosition: SnackPosition.bottom,
                                margin: const EdgeInsets.all(16),
                              );
                            }
                          },
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (vehicleMatchConfirmed) ...[
                                const Icon(
                                  Icons.check_circle,
                                  color: Colors.white,
                                  size: 18,
                                ),
                                const Gap(width: 8),
                              ],
                              AppText(
                                data: vehicleMatchConfirmed
                                    ? 'Match Confirmed'
                                    : 'Confirm Vehicle Match',
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              const Gap(height: 16),

              // Vehicle Details Confirmation
              if (type == 'TRANSPORT') ...[
                _buildCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const AppText(
                        data: 'Vehicle Details Confirmation',
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                      const Gap(height: 16),
                      if (type == 'INSPECTION') ...[
                        _buildInfoRow(
                          'Vehicle Type',
                          details['vehicleType'] ?? 'N/A',
                        ),
                        _buildInfoRow(
                          'Brand',
                          details['vehicleBrand'] ?? 'N/A',
                        ),
                        _buildInfoRow(
                          'Model',
                          details['vehicleModel'] ?? 'N/A',
                        ),
                      ] else ...[
                        _buildInfoRow(
                          'Vehicle Type',
                          details['vehicleType'] ?? 'N/A',
                        ),
                        _buildInfoRow('Brand', details['make'] ?? 'N/A'),
                        _buildInfoRow('Model', details['model'] ?? 'N/A'),
                        _buildInfoRow(
                          'Engine Type',
                          details['engineType'] ?? 'N/A',
                        ),
                      ],
                    ],
                  ),
                ),
                const Gap(height: 100),
              ],
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
              backgroundColor: (arrivalDeclared && vehicleMatchConfirmed)
                  ? const Color(0xFF60A5FA)
                  : const Color(0xFF93C5FD),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            onPressed: (arrivalDeclared && vehicleMatchConfirmed)
                ? () async {
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
                        widget.mission['_id'],
                        driverLocation!.latitude,
                        driverLocation!.longitude,
                        distanceFromTarget: distanceToPickup,
                      );

                      Get.back(); // close loading dialog

                      if (res.statusCode == 200) {
                        // Keep local state in sync so if the user goes back it skips verification
                        if (widget.mission['details'] == null) {
                          widget.mission['details'] = <String, dynamic>{};
                        }
                        widget.mission['details']['pickupVerification'] = {
                          'arrivalDeclared': true,
                          'vehicleMatchConfirmed': true,
                        };

                        if (type == 'INSPECTION') {
                          Get.to(
                            () => DeliveryInspectionScreen(
                              mission: widget.mission,
                              reqId: widget.reqId,
                            ),
                          );
                        } else {
                          Get.to(
                            () => PickupInspectionScreen(
                              mission: widget.mission,
                              reqId: widget.reqId,
                            ),
                          );
                        }
                      } else {
                        Get.snackbar(
                          'Error',
                          'Failed to verify pickup and store location',
                        );
                      }
                    } catch (e) {
                      Get.back(); // close loading dialog
                      Get.snackbar('Error', 'Network error. Please try again.');
                    }
                  }
                : null,
            child: const AppText(
              data: 'Confirm & Continue',
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCard({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: child,
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppText(data: label, fontSize: 12, color: const Color(0xFF64748B)),
          const Gap(height: 4),
          AppText(
            data: value,
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF0F172A),
          ),
        ],
      ),
    );
  }
}
