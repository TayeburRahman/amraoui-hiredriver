import 'package:intl/intl.dart';

String formatSellerOrderTime(String isoTimestamp) {
  DateTime dateTime = DateTime.parse(isoTimestamp).toLocal(); // Convert to local time
  return DateFormat("MMM d, yyyy h:mm a").format(dateTime);
}
