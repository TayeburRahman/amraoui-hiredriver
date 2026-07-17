import 'package:Vehiqqo/widgets/log_print/error_log.dart';

class AppDateTimeFormate {
  AppDateTimeFormate._privateConstructor();
  static final AppDateTimeFormate _instance =
      AppDateTimeFormate._privateConstructor();
  static AppDateTimeFormate get instance => _instance;

  String? userTimezone;

  String timeFormateTextMonthYear(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      DateTime? dateTime = DateTime.tryParse(inputDateTime);
      if (dateTime == null) return "";
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
      String month = monthNames[dateTime.month - 1];
      int year = dateTime.year;
      return "$month $year";
    } catch (e) {
      errorLog("timeFormateTextMonthYear", e);
      return "";
    }
  }

  String timeFormateTextDayMonthYear(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      DateTime? dateTime = DateTime.tryParse(inputDateTime);
      if (dateTime == null) return "";
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
      String month = monthNames[dateTime.month - 1];
      int year = dateTime.year;
      int day = dateTime.day;
      return "$day $month, $year";
    } catch (e) {
      errorLog("timeFormateTextMonthYear", e);
      return "";
    }
  }

  String timeFormateTextMonthDayYear(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      DateTime? dateTime = DateTime.tryParse(inputDateTime);
      if (dateTime == null) return "";
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

      String month = monthNames[dateTime.month - 1];
      int year = dateTime.year;
      int day = dateTime.day;
      return "$month $day, $year";
    } catch (e) {
      errorLog("timeFormateTextMonthYear", e);
      return "";
    }
  }

  String fullDateAndTimeConsultationFormateFunction(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      if (inputDateTime.isEmpty) return "";
      // Parse the input string to DateTime
      DateTime? tryDate = DateTime.tryParse(inputDateTime);

      if (tryDate == null) return "";

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      // Extract month, day, year, hour, and minute
      String month = months[tryDate.month - 1];

      int day = tryDate.day;
      int year = tryDate.year;
      int hour = tryDate.hour;
      int minute = tryDate.minute;

      // Determine AM or PM
      String period = hour >= 12 ? "PM" : "AM";

      // Convert hour to 12-hour format
      hour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);

      // Format minute to always show 2 digits
      String minuteStr = minute.toString().padLeft(2, '0');

      // Build the formatted string
      return "$month $day, $year  $hour:$minuteStr $period";
    } catch (e) {
      errorLog("fullDateAndTimeFormateFunction", e);
      return "";
    }
  }

  String dateAndTimeFormateFunction(String? inputDateTime) {
    try {
      if (inputDateTime == null || inputDateTime.isEmpty) return "";

      DateTime? tryDate = DateTime.tryParse(inputDateTime);
      if (tryDate == null) return "";

      const months = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
      ];
      const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      // Get parts
      String month = months[tryDate.month - 1];
      String weekday = weekdays[tryDate.weekday - 1];

      int day = tryDate.day;
      int hour = tryDate.hour;
      int minute = tryDate.minute;

      // Day suffix (st, nd, rd, th)
      String suffix;
      if (day >= 11 && day <= 13) {
        suffix = "th";
      } else {
        switch (day % 10) {
          case 1:
            suffix = "st";
            break;
          case 2:
            suffix = "nd";
            break;
          case 3:
            suffix = "rd";
            break;
          default:
            suffix = "th";
        }
      }

      // Determine AM/PM
      String period = hour >= 12 ? "PM" : "AM";

      // Convert to 12-hour format
      hour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);

      // Format minutes
      String minuteStr = minute.toString().padLeft(2, '0');

      // Build formatted string
      return " $day$suffix $month - $weekday - $hour:$minuteStr $period";
    } catch (e) {
      // errorLog("dateAndTimeFormateFunction", e);
      return "";
    }
  }

  String timePeriod(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      DateTime? tryDate = DateTime.tryParse(inputDateTime);

      if (tryDate == null) return "";

      final DateTime now = DateTime.now();
      final Duration difference = now.difference(tryDate);

      if (difference.inDays == 0) {
        // If the date is today, return the time in hh:mm a format
        int hour = tryDate.hour;
        int minute = tryDate.minute;
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
    } catch (e) {
      errorLog("timePeriod", e);
      return "";
    }
  }

  String time(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      if (inputDateTime.isEmpty) return "";
      // Parse the input string to DateTime
      DateTime? tryDate = DateTime.tryParse(inputDateTime);

      if (tryDate == null) return "";

      int hour = tryDate.hour;
      int minute = tryDate.minute;

      // Determine AM or PM
      String period = hour >= 12 ? "PM" : "AM";

      // Convert hour to 12-hour format
      hour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);

      // Format minute to always show 2 digits
      String minuteStr = minute.toString().padLeft(2, '0');

      // Build the formatted string
      return "$hour:$minuteStr $period";
    } catch (e) {
      errorLog("time", e);
      return "";
    }
  }

  String month(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      DateTime? dateTime = DateTime.tryParse(inputDateTime);
      if (dateTime == null) return "";
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

      String month = monthNames[dateTime.month - 1];

      return month;
    } catch (e) {
      errorLog("month", e);
      return "";
    }
  }

  String day(String? inputDateTime) {
    try {
      if (inputDateTime == null) return "";
      DateTime? dateTime = DateTime.tryParse(inputDateTime);
      if (dateTime == null) return "";
      int day = dateTime.day;
      return "$day";
    } catch (e) {
      errorLog("day", e);
      return "";
    }
  }
}
