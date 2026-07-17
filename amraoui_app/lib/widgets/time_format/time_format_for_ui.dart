import 'package:Vehiqqo/widgets/log_print/error_log.dart';
import 'package:intl/intl.dart';

String formatDateTimeForDetails(String isoString) {
  try {
    final dateTime = DateTime.tryParse(isoString);
    if (dateTime == null) {
      return "N/A";
    }
    return DateFormat('dd/MM/yyyy HH:mm').format(dateTime.toLocal());
  } catch (e) {
    errorLog("Error From Formate Time ", e);
  }
  return "N/A";
}

String formatEventDateRange(DateTime startDate, DateTime endDate) {
  // Define a date format
  var dateFormat = DateFormat('dd/MM/yyyy HH:mm');

  // Format the start and end dates
  String startDateString = dateFormat.format(startDate);
  String endDateString = dateFormat.format(endDate);

  // Return the formatted date range
  return '$startDateString - $endDateString';
}
