import 'package:flutter/material.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';

Future<dynamic> successDialogBox({required BuildContext context, String? text}) {
  return showDialog(
    context: context,
    builder: (context) {
      Future.delayed(const Duration(seconds: 1), () {});
      return Dialog(
        backgroundColor: Colors.white60,
        child: Container(
          decoration: const BoxDecoration(
              // color: AppColors.white100,
              borderRadius: BorderRadius.all(Radius.circular(20))),
          margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
          // height: AppSize.size.height * 0.30,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Image.asset(
              //   AssetsImagesPath.success,
              //   height: 100,
              // ),
              Gap(height: AppSize.size.height * 0.04),
              AppText(
                data: text ?? "Text Here....",
                fontWeight: FontWeight.w600,
                color: Colors.white60,
                fontSize: 18,
              ),
            ],
          ),
        ),
      );
    },
  );
}
