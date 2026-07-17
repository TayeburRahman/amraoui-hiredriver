import 'package:flutter/material.dart';
import 'package:Vehiqqo/const/app_const/google_mao_key.dart';
import 'package:Vehiqqo/widgets/log_print/error_log.dart';
import 'package:get/get.dart';
import 'package:map_location_picker/map_location_picker.dart';
import 'package:permission_handler/permission_handler.dart';

class MapValueGet extends StatefulWidget {
  const MapValueGet({super.key, required this.onMapSelected});
  final Function(GeocodingResult result) onMapSelected;

  @override
  State<MapValueGet> createState() => _MapValueGetState();
}

class _MapValueGetState extends State<MapValueGet> {
  RxBool isLoading = false.obs;
  RxBool isPermissionGranted = false.obs;

  Future<LatLng?> getCurrentLocation() async {
    try {
      isLoading.value = true;
      bool serviceEnabled;
      LocationPermission permission;

      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return null;
      }

      permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.deniedForever) {
        isPermissionGranted.value = false;
        return null;
      }

      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission != LocationPermission.whileInUse &&
            permission != LocationPermission.always) {
          isPermissionGranted.value = false;
          return null;
        }
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      isPermissionGranted.value = true;
      return LatLng(position.latitude, position.longitude);
    } catch (e) {
      errorLog("Error From getCurrentLocation", e);
      isPermissionGranted.value = false;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: FutureBuilder<LatLng?>(
          future: getCurrentLocation(),
          builder: (context, snapshot) {
            if (isLoading.value) {
              return const Center(
                child: CircularProgressIndicator(color: Colors.black),
              );
            }

            if (!isPermissionGranted.value) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.location_off, size: 50, color: Colors.red),
                    const SizedBox(height: 20),
                    const Text(
                      'Location permission is required to view the map.',
                      style: TextStyle(fontSize: 16, color: Colors.red),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () async {
                        LocationPermission permission =
                            await Geolocator.checkPermission();
                        if (permission == LocationPermission.deniedForever ||
                            permission == LocationPermission.denied) {
                          await openAppSettings();
                        } else {
                          await Geolocator.requestPermission();
                        }

                        setState(() {});
                      },
                      child: const Text('Grant Permission'),
                    ),
                  ],
                ),
              );
            }

            if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            }

            LatLng currentLatLngValue =
                snapshot.data ?? const LatLng(23.0100, 91.3992);

            return MapLocationPicker(
              hideLocationButton: true,
              hideMapTypeButton: true,
              hideBottomCard: false,
              hideBackButton: true,
              apiKey: AppConstMapKey.instance.googleMapApiKey,
              popOnNextButtonTaped: true,
              bottom: false,
              hideMoreOptions: false,
              topCardColor: Colors.white,
              bottomCardColor: Colors.white,
              onNext: (result) async {
                if (result != null) {
                  widget.onMapSelected(result);
                }
              },
              currentLatLng: currentLatLngValue,
              debounceDuration: const Duration(milliseconds: 500),
            );
          },
        ),
      ),
    );
  }
}
