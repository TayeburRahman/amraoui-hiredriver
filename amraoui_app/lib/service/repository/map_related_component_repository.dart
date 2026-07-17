import 'package:Vehiqqo/const/app_const/google_mao_key.dart';
import 'package:Vehiqqo/service/api/api.dart';
import 'package:Vehiqqo/widgets/log_print/error_log.dart';

class MapRelatedComponentRepository {
  Future<List<double>> getCityLatLong({
    required String city,
    required int initialLat,
    required int initialLong,
  }) async {
    try {
      var response = await AppApi().sendRequest.get(
        "https://maps.googleapis.com/maps/api/geocode/json?address=$city&key=${AppConstMapKey.instance.googleMapApiKey}",
      );
      if (response.data != null) {
        if (response.data["results"] != null &&
            response.data["results"] is List) {
          var result = (response.data["results"] as List).first;
          if (result["geometry"] != null && result["geometry"] is Map) {
            var geometry = result["geometry"];
            if (geometry["location"] != null && geometry["location"] is Map) {
              var location = geometry["location"];
              var lat =
                  double.tryParse("${location["lat"]}") ??
                  double.tryParse("$initialLat");
              var lng =
                  double.tryParse("${location["lng"]}") ??
                  double.tryParse("$initialLong");
              return [lat!, lng!];
            }
          }
        }
      }
    } catch (e) {
      errorLog("getCityLatLong", e);
    }
    return [
      double.tryParse("$initialLat") ?? 0.0,
      double.tryParse("$initialLong") ?? 0.0,
    ];
  }
}

var item = {
  "results": [
    {
      "address_components": [
        {
          "long_name": "Dhaka",
          "short_name": "Dhaka",
          "types": ["locality", "political"],
        },
        {
          "long_name": "Dhaka District",
          "short_name": "Dhaka District",
          "types": ["administrative_area_level_2", "political"],
        },
        {
          "long_name": "Dhaka Division",
          "short_name": "Dhaka Division",
          "types": ["administrative_area_level_1", "political"],
        },
        {
          "long_name": "Bangladesh",
          "short_name": "BD",
          "types": ["country", "political"],
        },
      ],
      "formatted_address": "Dhaka, Bangladesh",
      "geometry": {
        "bounds": {
          "northeast": {"lat": 23.9001266, "lng": 90.50918609999999},
          "southwest": {"lat": 23.6615544, "lng": 90.3301919},
        },
        "location": {"lat": 23.804093, "lng": 90.4152376},
        "location_type": "APPROXIMATE",
        "viewport": {
          "northeast": {"lat": 23.9001266, "lng": 90.50918609999999},
          "southwest": {"lat": 23.6615544, "lng": 90.3301919},
        },
      },
      "place_id": "ChIJgWsCh7C4VTcRwgRZ3btjpY8",
      "types": ["locality", "political"],
    },
  ],
  "status": "OK",
};
