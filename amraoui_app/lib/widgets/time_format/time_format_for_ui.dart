import 'package:amraoui_app/widgets/log_print/error_log.dart';
import 'package:intl/intl.dart';

String formatDateTimeForDetails(String isoString) {
 try {
    final dateTime = DateTime.tryParse(isoString);
  final months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  final days = [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  ];
  if (dateTime == null) {
    return "N/A";
    
  }

  String month = months[dateTime.month - 1];
  String day = days[dateTime.weekday - 1];
  String hour = dateTime.hour > 12 ? (dateTime.hour - 12).toString() : dateTime.hour.toString();
  String minute = dateTime.minute.toString().padLeft(2, '0');
  String period = dateTime.hour >= 12 ? 'PM' : 'AM';

  return '$month ${dateTime.day}, ${dateTime.year} $day at $hour:$minute $period';
 } catch (e) {
   errorLog("Error From Formate Time ", e);
 }
 return "N/A";
}


String formatEventDateRange(DateTime startDate, DateTime endDate) {
  // Define a date format
  var dateFormat = DateFormat('MMM dd, h:mm a'); 

  // Format the start and end dates
  String startDateString = dateFormat.format(startDate);
  String endDateString = dateFormat.format(endDate);

  // Return the formatted date range
  return '$startDateString - $endDateString';
}
