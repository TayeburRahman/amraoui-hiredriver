import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:dio/dio.dart';
import 'package:Vehiqqo/const/app_const/google_mao_key.dart';

class LocationHelper {
  /// Geocodes an address string using Google Maps Geocoding API and returns a LatLng object.
  static Future<LatLng?> geocodeAddress(String address) async {
    if (address.trim().isEmpty) return null;
    try {
      final apiKey = AppConstMapKey.instance.googleMapApiKey;
      final url =
          'https://maps.googleapis.com/maps/api/geocode/json?address=${Uri.encodeComponent(address)}&key=$apiKey';
      final response = await Dio().get(url);

      if (response.statusCode == 200 && response.data != null) {
        if (response.data['status'] == 'OK' &&
            response.data['results'] != null &&
            response.data['results'].isNotEmpty) {
          final location = response.data['results'][0]['geometry']['location'];
          if (location != null) {
            return LatLng(location['lat'], location['lng']);
          }
        }
      }
    } catch (e) {
      // Failed to geocode
    }
    return null;
  }

  /// Calculates the straight-line distance in meters between two LatLng points.
  static double calculateDistanceInMeters(LatLng point1, LatLng point2) {
    return Geolocator.distanceBetween(
      point1.latitude,
      point1.longitude,
      point2.latitude,
      point2.longitude,
    );
  }
}
