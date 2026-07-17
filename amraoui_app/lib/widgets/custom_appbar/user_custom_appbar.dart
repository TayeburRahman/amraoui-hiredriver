import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:flutter/material.dart';

AppBar customerCustomAppBar({required String title}) {
  return AppBar(
    centerTitle: true,
    title: AppText(
      data: title,
      color: Colors.white,
      fontWeight: FontWeight.w600,
      fontSize: 20,
    ),
    foregroundColor: Colors.white,
    backgroundColor: AppColors.primary,
  );
}
