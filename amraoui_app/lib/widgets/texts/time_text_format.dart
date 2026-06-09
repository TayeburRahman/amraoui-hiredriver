String timeTextFormate(DateTime dateTime) {
  final DateTime now = DateTime.now();
  final Duration difference = now.difference(dateTime);

  if (difference.inDays == 0) {
    // If the date is today, return the time in hh:mm a format
    int hour = dateTime.hour;
    int minute = dateTime.minute;
    String period = hour >= 12 ? 'pm' : 'am';

    if (hour > 12) {
      hour -= 12;
    } else if (hour == 0) {
      hour = 12;
    }

    final String minuteStr = minute < 10 ? '0$minute' : '$minute';
    return '$hour:$minuteStr $period';
  } else if (difference.inDays == 1) {
    return '1 day';
  } else if (difference.inDays < 7) {
    return '${difference.inDays} days';
  } else if (difference.inDays < 30) {
    return '${difference.inDays ~/ 7} week${difference.inDays ~/ 7 > 1 ? 's' : ''}';
  } else if (difference.inDays < 365) {
    return '${difference.inDays ~/ 30} month${difference.inDays ~/ 30 > 1 ? 's' : ''}';
  } else {
    return '${difference.inDays ~/ 365} year${difference.inDays ~/ 365 > 1 ? 's' : ''} ';
  }
}
