String formatTimeForNotification(String? isoString) {
  if (isoString == null || isoString.isEmpty) {
    return "";
  }

  DateTime? dateTime;

  try {
    dateTime = DateTime.parse(isoString).toLocal();
  } catch (e) {
    return "";
  }

  final day = dateTime.day.toString().padLeft(2, '0');
  final monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  final month = monthNames[dateTime.month - 1];
  final year = dateTime.year;

  int hour = dateTime.hour;
  final minute = dateTime.minute.toString().padLeft(2, '0');
  final period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 == 0 ? 12 : hour % 12;

  return '$day-$month-$year, $hour:$minute $period';
}

String formatTimeDateTime(String? isoString) {
  if (isoString == null || isoString.isEmpty) {
    return "";
  }

  DateTime? dateTime;

  try {
    dateTime = DateTime.parse(isoString).toLocal();
  } catch (e) {
    return "";
  }

  final day = dateTime.day.toString().padLeft(2, '0');

  final month = dateTime.month.toString().padLeft(2, '0');
  final year = dateTime.year;

  return '$day-$month-$year';
}
