import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/utils/app_size.dart';

class OtpInputFieldWidget extends StatelessWidget {
  const OtpInputFieldWidget({
    super.key,
    this.isLast = false,
    this.textInputAction = TextInputAction.next,
    this.fillColor = AppColors.deepWhte,
    this.borderColor = AppColors.primaryTextColor,
    this.radius = 10.0,
    this.controller,
    this.onFieldSubmitted,
    this.onChanged,
  });
  final bool isLast;
  final TextInputAction? textInputAction;
  final Color? fillColor;
  final Color borderColor;
  final double radius;
  final TextEditingController? controller;
  final void Function(String)? onFieldSubmitted;
  final void Function(String)? onChanged;
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: AppSize.width(value: 50),
      child: TextFormField(
        validator: (value) {
          if (value == null || value.isEmpty) {
            return "";
          }
          return null;
        },
        keyboardType: TextInputType.phone,
        textAlign: TextAlign.center,
        textInputAction: textInputAction,
        onFieldSubmitted: onFieldSubmitted,
        onChanged:
            onChanged ??
            (value) {
              if (value.isNotEmpty && !isLast) {
                FocusManager.instance.primaryFocus?.nextFocus();
              }
            },
        inputFormatters: [
          LengthLimitingTextInputFormatter(1),
          FilteringTextInputFormatter.digitsOnly,
        ],
        controller: controller,
        decoration: InputDecoration(
          errorStyle: const TextStyle(height: 0, fontSize: 0.0),
          filled: true,
          fillColor: fillColor,
          border: OutlineInputBorder(
            borderSide: BorderSide(color: borderColor, width: 2),
            borderRadius: BorderRadius.circular(radius),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: borderColor, width: 2),
            borderRadius: BorderRadius.circular(radius),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: borderColor, width: 2),
            borderRadius: BorderRadius.circular(radius),
          ),
          disabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: borderColor, width: 2),
            borderRadius: BorderRadius.circular(radius),
          ),
          errorBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.red, width: 1.5),
            borderRadius: BorderRadius.circular(radius),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.red, width: 1.5),
            borderRadius: BorderRadius.circular(radius),
          ),
        ),
      ),
    );
  }
}
