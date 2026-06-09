import 'package:flutter/services.dart';

class LeadingZeroRemoverFormatter extends TextInputFormatter {
  final bool isDecimal;

  LeadingZeroRemoverFormatter({this.isDecimal = false});

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    String text = newValue.text;

    if (text.startsWith('0')) {
      text = text.replaceFirst(RegExp(r'^0+'), '');
    }

    final regex = isDecimal ? RegExp(r'^\d*\.?\d*$') : RegExp(r'^\d*$');

    if (!regex.hasMatch(text)) {
      return oldValue;
    }

    return newValue.copyWith(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}
