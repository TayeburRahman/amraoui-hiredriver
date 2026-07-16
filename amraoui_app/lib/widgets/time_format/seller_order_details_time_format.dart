import 'package:intl/intl.dart';

String formatSellerOrderTime(String isoTimestamp) {
  DateTime dateTime = DateTime.parse(isoTimestamp).toLocal(); // Convert to local time
  return DateFormat("dd/MM/yyyy HH:mm").format(dateTime);
}
