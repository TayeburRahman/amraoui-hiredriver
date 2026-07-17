import 'package:Vehiqqo/service/repository/mission_repository.dart';
import 'package:get/get.dart';

class InvoicesController extends GetxController {
  final MissionRepository _missionRepository = MissionRepository();

  var isLoading = true.obs;
  var completedMissions = <Map<String, dynamic>>[].obs;

  var totalEarnings = 0.0.obs;
  var thisMonthEarnings = 0.0.obs;

  @override
  void onInit() {
    super.onInit();
    fetchInvoices();
  }

  Future<void> fetchInvoices() async {
    isLoading.value = true;
    try {
      final res = await _missionRepository.getMissions();
      if (res.statusCode == 200 && res.data['success'] == true) {
        final List<dynamic> missionsData = res.data['data'] ?? [];

        final completed = missionsData
            .map((e) => e as Map<String, dynamic>)
            .where((m) => m['status'] == 'COMPLETED')
            .toList();

        completedMissions.value = completed;

        _calculateEarnings(completed);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to fetch invoices');
    } finally {
      isLoading.value = false;
    }
  }

  void _calculateEarnings(List<Map<String, dynamic>> missions) {
    double total = 0.0;
    double thisMonth = 0.0;

    final now = DateTime.now();

    for (var mission in missions) {
      // Find my accepted quote
      double missionAmount = 0.0;
      if (mission['driverQuotes'] != null) {
        for (var quote in mission['driverQuotes']) {
          if (quote['status'] == 'ACCEPTED') {
            missionAmount = (quote['amount'] as num).toDouble();
            break;
          }
        }
      }

      total += missionAmount;

      // Check if mission was completed this month
      if (mission['updatedAt'] != null) {
        final updatedAt = DateTime.tryParse(mission['updatedAt']);
        if (updatedAt != null &&
            updatedAt.year == now.year &&
            updatedAt.month == now.month) {
          thisMonth += missionAmount;
        }
      }
    }

    totalEarnings.value = total;
    thisMonthEarnings.value = thisMonth;
  }
}
