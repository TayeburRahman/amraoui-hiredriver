import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/const/app_const/app_const.dart';

class AppText extends StatelessWidget {
  const AppText({
    super.key,
    required this.data,
    this.fontSize = 16,
    this.textScaleFactor = 0.9,
    this.color,
    this.decorationColor,
    this.fontWeight,
    this.maxLines,
    this.overflow,
    this.textAlign,
    this.height,
    this.softWrap,
    this.decoration,
    this.textDirection,
    this.fontFamily,
    this.letterSpacing,
    this.fontStyle,
  });
  final String data;
  final double? fontSize;
  final double textScaleFactor;
  final Color? color;
  final Color? decorationColor;
  final FontWeight? fontWeight;
  final int? maxLines;
  final TextOverflow? overflow;
  final TextAlign? textAlign;
  final double? height;
  final bool? softWrap;
  final TextDecoration? decoration;
  final TextDirection? textDirection;
  final String? fontFamily;
  final double? letterSpacing;
  final FontStyle? fontStyle;
  @override
  Widget build(BuildContext context) {
    return Text(
      data.tr,
      maxLines: maxLines,
      overflow: overflow,
      textAlign: textAlign,
      softWrap: softWrap,
      textDirection: textDirection ?? TextDirection.ltr,
      style: Theme.of(context).textTheme.displaySmall?.copyWith(
        height: height,
        fontSize: fontSize,
        color: color ?? Colors.black,
        fontWeight: fontWeight,
        fontFamily: fontFamily ?? AppConst.manrope,
        decoration: decoration,
        decorationColor: decorationColor,
        letterSpacing: letterSpacing,
        fontStyle: fontStyle,
      ),
      textScaler: TextScaler.linear(textScaleFactor),
    );
  }
}
