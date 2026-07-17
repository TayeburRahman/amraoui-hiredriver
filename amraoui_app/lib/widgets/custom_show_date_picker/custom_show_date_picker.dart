import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';

Future<DateTime?> customShowDatePicker({
  required BuildContext context,
  DateTime? initialDate,
  DateTime? firstDate,
  DateTime? lastDate,
}) {
  return showDialog<DateTime>(
    context: context,
    builder: (BuildContext context) {
      return CustomDatePickerDialog(
        initialDate: initialDate ?? DateTime.now(),
        firstDate: firstDate ?? DateTime(1900),
        lastDate: lastDate ?? DateTime(2100),
      );
    },
  );
}

class CustomDatePickerDialog extends StatefulWidget {
  final DateTime initialDate;
  final DateTime firstDate;
  final DateTime lastDate;

  const CustomDatePickerDialog({
    super.key,
    required this.initialDate,
    required this.firstDate,
    required this.lastDate,
  });

  @override
  State createState() => _CustomDatePickerDialogState();
}

class _CustomDatePickerDialogState extends State<CustomDatePickerDialog> {
  late DateTime _selectedDate;

  @override
  void initState() {
    super.initState();
    _selectedDate = widget.initialDate;
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.primary,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Padding(
            padding: EdgeInsets.only(top: AppSize.width(value: 5)),
            child: Theme(
              data: ThemeData(
                colorScheme: const ColorScheme.light(
                  primary: AppColors.primary,
                ),
              ),
              child: CalendarDatePicker(
                initialDate: _selectedDate,
                firstDate: widget.firstDate,
                lastDate: widget.lastDate,
                onDateChanged: (DateTime date) {
                  setState(() {
                    _selectedDate = date;
                  });
                },
              ),
            ),
          ),
          GestureDetector(
            onTap: () {
              Navigator.of(context).pop(_selectedDate);
            },
            child: Container(
              padding: EdgeInsets.symmetric(
                vertical: AppSize.width(value: 10.0),
                horizontal: AppSize.width(value: 30.0),
              ),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(AppSize.width(value: 10)),
              ),
              child: const AppText(
                data: "Apply",
                color: AppColors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const Gap(height: 30),
        ],
      ),
    );
  }
}
