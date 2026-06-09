String timeDateFormate(DateTime dateTime) {
  const List<String> monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  int day = dateTime.day;
  String month = monthNames[dateTime.month - 1];
  int year = dateTime.year;

  return '$day $month $year';
}
