import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:amraoui_app/service/repository/mission_repository.dart';
import 'package:amraoui_app/screens/missions/delivery_inspection_screen.dart';
import 'package:amraoui_app/utils/location_helper.dart';

class DeliveryArrivalScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;

  const DeliveryArrivalScreen({
    super.key,
    required this.mission,
    required this.reqId,
  });

  @override
  State<DeliveryArrivalScreen> createState() => _DeliveryArrivalScreenState();
}

class _DeliveryArrivalScreenState extends State<DeliveryArrivalScreen> {
  bool isArrivalDeclared = false;
  String? arrivalTime;
  bool isLoadingLocation = true;
  bool isDeclaring = false;
  LatLng? currentLocation;
  double? distanceToDelivery;
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    // Check if arrival is already declared
    final details = widget.mission['details'];
    if (details != null && details['deliveryArrivalDeclared'] == true) {
      isArrivalDeclared = true;
      try {
        final parsed = DateTime.parse(details['deliveryArrivalTime'].toString());
        arrivalTime = DateFormat('HH:mm').format(parsed.toLocal());
      } catch (e) {
        arrivalTime = details['deliveryArrivalTime']?.toString();
      }
      if (details['deliveryArrivalLocation'] != null) {
        currentLocation = LatLng(
          details['deliveryArrivalLocation']['coordinates'][1] ?? 0.0,
          details['deliveryArrivalLocation']['coordinates'][0] ?? 0.0,
        );
        isLoadingLocation = false;
      } else {
        _getCurrentLocation();
      }
    } else {
      _getCurrentLocation();
    }
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      setState(() => isLoadingLocation = false);
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        setState(() => isLoadingLocation = false);
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      setState(() => isLoadingLocation = false);
      return;
    }

    try {
      Position position = await Geolocator.getCurrentPosition();
      setState(() {
        currentLocation = LatLng(position.latitude, position.longitude);
      });
      
      final details = widget.mission['details'] ?? {};
      final dAddress = details['dropoffAddress']?.toString() ?? '';
      final dZip = details['dropoffZip']?.toString() ?? '';
      final dCity = details['dropoffCity']?.toString() ?? '';
      final dCountry = details['dropoffCountry']?.toString() ?? '';
      final dLocation = [dAddress, dZip, dCity, dCountry].where((e) => e.isNotEmpty).join(', ');

      if (dLocation.isNotEmpty) {
        final targetLatLng = await LocationHelper.geocodeAddress(dLocation);
        if (targetLatLng != null && currentLocation != null) {
          if (mounted) {
            setState(() {
              distanceToDelivery = LocationHelper.calculateDistanceInMeters(currentLocation!, targetLatLng);
            });
          }
        }
      }

      if (mounted) {
        setState(() {
          isLoadingLocation = false;
        });
      }
    } catch (e) {
      setState(() => isLoadingLocation = false);
    }
  }

  Future<void> _declareArrival() async {
    if (currentLocation == null) {
      Get.snackbar('Error', 'Unable to get your current location.');
      return;
    }

    setState(() {
      isDeclaring = true;
    });

    try {
      final repo = MissionRepository();
      final res = await repo.verifyDeliveryArrival(
        widget.mission['_id'] ?? widget.reqId, 
        currentLocation!.latitude, 
        currentLocation!.longitude,
        distanceFromTarget: distanceToDelivery,
      );

      if (res.statusCode == 200) {
        setState(() {
          isArrivalDeclared = true;
          arrivalTime = DateFormat('HH:mm').format(DateTime.now());
          
          if (widget.mission['details'] == null) {
            widget.mission['details'] = <String, dynamic>{};
          }
          widget.mission['details']['deliveryArrivalDeclared'] = true;
          widget.mission['details']['deliveryArrivalTime'] = arrivalTime;
        });
        Get.snackbar('Success', 'Delivery arrival declared successfully.');
      } else {
        Get.snackbar('Error', 'Failed to declare arrival');
      }
    } catch (e) {
      Get.snackbar('Error', 'Network error. Please try again.');
    } finally {
      if (mounted) {
        setState(() {
          isDeclaring = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final details = widget.mission['details'] ?? {};
    final dAddress = details['dropoffAddress']?.toString() ?? '';
    final dCity = details['dropoffCity']?.toString() ?? '';
    final dZip = details['dropoffZip']?.toString() ?? '';
    final addressStr = [dAddress, dZip, dCity].where((s) => s.isNotEmpty).join(', ');
    final address = addressStr.isNotEmpty ? addressStr : 'Address not specified';

    final receiverName = details['dropoffContactName']?.toString() ?? 'Unknown';
    final receiverPhone = details['dropoffContactPhone']?.toString() ?? '';
    final receiverCompany = details['dropoffCompany']?.toString() ?? '';

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
                data: 'Delivery Arrival',
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
              
              // Delivery Address Card
              _buildCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const AppText(data: 'Delivery Address', fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    const Gap(height: 16),
                    const AppText(data: 'Address', fontSize: 13, color: Color(0xFF64748B)),
                    const Gap(height: 4),
                    AppText(data: address, fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF334155)),
                    const Gap(height: 20),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const AppText(data: 'Actual Arrival', fontSize: 12, color: Color(0xFF64748B)),
                        const Gap(height: 4),
                        Row(
                          children: [
                            Icon(
                              Icons.access_time, 
                              size: 16, 
                              color: (isArrivalDeclared && distanceToDelivery != null && distanceToDelivery! > 100)
                                  ? Colors.red
                                  : isArrivalDeclared ? const Color(0xFF10B981) : const Color(0xFF94A3B8)
                            ),
                            const Gap(width: 4),
                            AppText(
                              data: isArrivalDeclared ? (arrivalTime ?? '--:--') : '--:--', 
                              fontSize: 14, 
                              fontWeight: FontWeight.bold, 
                              color: (isArrivalDeclared && distanceToDelivery != null && distanceToDelivery! > 100)
                                  ? Colors.red
                                  : isArrivalDeclared ? const Color(0xFF10B981) : const Color(0xFF94A3B8)
                            ),
                          ],
                        ),
                      ],
                    ),
                    if (isArrivalDeclared && distanceToDelivery != null && distanceToDelivery! > 100) ...[
                      const Gap(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red.shade200),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.warning_amber_rounded, color: Colors.red.shade600, size: 20),
                            const Gap(width: 8),
                            Expanded(
                              child: AppText(
                                data: 'Warning: You are ${(distanceToDelivery! / 1000).toStringAsFixed(1)} km away from the expected location.',
                                fontSize: 12,
                                color: Colors.red.shade700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              
              const Gap(height: 16),
              
              // Receiver Information Card
              _buildCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const AppText(data: 'Receiver Information', fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    const Gap(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.person_outline, size: 18, color: Color(0xFF475569)),
                              const Gap(width: 8),
                              AppText(data: receiverName, fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF0F172A)),
                            ],
                          ),
                          if (receiverPhone.isNotEmpty) ...[
                            const Gap(height: 12),
                            AppText(data: receiverPhone, fontSize: 14, color: const Color(0xFF64748B)),
                          ],
                          if (receiverCompany.isNotEmpty) ...[
                            const Gap(height: 4),
                            AppText(data: receiverCompany, fontSize: 14, color: const Color(0xFF64748B)),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const Gap(height: 16),

              // GPS Location Verification
              _buildCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.location_on_outlined, color: Color(0xFF2563EB), size: 20),
                        Gap(width: 8),
                        AppText(data: 'GPS Location Verification', fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ],
                    ),
                    const Gap(height: 16),
                    Container(
                      height: 140,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      clipBehavior: Clip.hardEdge,
                      child: isLoadingLocation
                        ? const Center(child: CircularProgressIndicator())
                        : currentLocation == null
                          ? const Center(
                              child: AppText(data: 'Location permission required', color: Color(0xFF94A3B8), fontSize: 13),
                            )
                          : FlutterMap(
                              mapController: _mapController,
                              options: MapOptions(
                                initialCenter: currentLocation!,
                                initialZoom: 15.0,
                              ),
                              children: [
                                TileLayer(
                                  urlTemplate: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
                                  subdomains: const ['a', 'b', 'c', 'd'],
                                  userAgentPackageName: 'com.example.amraoui_app',
                                ),
                                MarkerLayer(
                                  markers: [
                                    Marker(
                                      point: currentLocation!,
                                      width: 40,
                                      height: 40,
                                      child: const Icon(
                                        Icons.location_on,
                                        color: Color(0xFF2563EB),
                                        size: 40,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                    ),
                    const Gap(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.zero,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                        ),
                        onPressed: isArrivalDeclared ? null : _declareArrival,
                        child: Ink(
                          decoration: BoxDecoration(
                            gradient: isArrivalDeclared ? null : const LinearGradient(
                              colors: [Color(0xFF3B82F6), Color(0xFFA855F7)],
                            ),
                            color: isArrivalDeclared ? const Color(0xFFE2E8F0) : null,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Container(
                            alignment: Alignment.center,
                            child: isDeclaring
                              ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : AppText(
                                  data: isArrivalDeclared ? 'Arrival Declared' : 'Declare Arrival / Verify Pin', 
                                  color: isArrivalDeclared ? const Color(0xFF94A3B8) : Colors.white, 
                                  fontWeight: FontWeight.bold, 
                                  fontSize: 15
                                ),
                          ),
                        ),
                      ),
                    ),
                  ],
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
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            onPressed: isArrivalDeclared ? () {
              Get.to(() => DeliveryInspectionScreen(
                mission: widget.mission,
                reqId: widget.reqId,
              ));
            } : null,
            child: Ink(
              decoration: BoxDecoration(
                gradient: isArrivalDeclared ? const LinearGradient(
                  colors: [Color(0xFF3B82F6), Color(0xFFA855F7)], // Vibrant Blue to Purple gradient
                ) : null,
                color: isArrivalDeclared ? null : const Color(0xFFE0E7FF),
                borderRadius: BorderRadius.circular(12),
                boxShadow: isArrivalDeclared ? [
                  BoxShadow(
                    color: const Color(0xFF3B82F6).withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  )
                ] : null,
              ),
              child: Container(
                alignment: Alignment.center,
                child: AppText(
                  data: 'Continue to Delivery Inspection', 
                  color: isArrivalDeclared ? Colors.white : const Color(0xFF94A3B8), 
                  fontWeight: FontWeight.bold, 
                  fontSize: 15
                ),
              ),
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
}
