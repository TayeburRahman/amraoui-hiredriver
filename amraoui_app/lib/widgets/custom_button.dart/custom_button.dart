import 'package:flutter/material.dart';
import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';
import 'package:get/get.dart';

class CustomButton extends StatelessWidget {
  const CustomButton({
    super.key,
    this.text,
    this.fontSize = 16,
    this.textColor,
    this.color,
    this.fontWeight,
    this.height,
    this.width,
    this.borderRadius,
    this.padding,
    this.onTap,
    this.gradient,
    this.observeable = false,
    this.isLoading = false,
  });
  final String? text;
  final double? fontSize;
  final Color? textColor;
  final Color? color;
  final FontWeight? fontWeight;
  final double? height;
  final double? width;
  final double? borderRadius;
  final double? padding;
  final void Function()? onTap;
  final Gradient? gradient;
  final bool isLoading;
  final bool observeable;

  @override
  Widget build(BuildContext context) {
    return observeable == true
        ? Obx(
            () => Container(
              height: height ?? 50,
              width: width ?? double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(borderRadius ?? 10),
              ),
              child: FittedBox(
                child: ElevatedButton(
                  // style: ElevatedButton.styleFrom(
                  //     elevation: 5,
                  //     backgroundColor: color ?? AppColors.white,
                  //     foregroundColor: AppColors.black),
                  onPressed: onTap,
                  child: isLoading
                      ? const Center(
                          child: CircularProgressIndicator(color: Colors.black),
                        )
                      : AppText(
                          data: text ?? "Text Here...",
                          color: textColor ?? AppColors.black,
                          fontWeight: fontWeight ?? FontWeight.w900,
                          fontSize: fontSize ?? 16,
                        ),
                ),
              ),
            ),

            //   Padding(
            //     padding: EdgeInsets.all(padding ?? 20),
            //     child: GestureDetector(
            //       onTap: onTap,
            //       child: Container(
            //         width: width ?? Get.width,
            //         height: height ?? AppSize.width(value: 50.0),
            //         alignment: Alignment.center,
            //         decoration: BoxDecoration(
            //           color: color,
            //           // gradient: gradient ?? AppColors.gradientColors,
            //           // color: AppColors.deepWhte,
            //           borderRadius: BorderRadius.circular(
            //             borderRadius ?? AppSize.width(value: 8),
            //           ),
            //         ),
            //         child: isLoading
            //             ? const Center(
            //                 child: CircularProgressIndicator(
            //                   color: Colors.black,
            //                 ),
            //               )
            //             : AppText(
            //                 data: text ?? "Text Here....",
            //                 fontSize: fontSize ?? 18,
            //                 color: textColor ?? AppColors.primary,
            //                 fontWeight: fontWeight ?? FontWeight.w600,
            //               ),
            //       ),
            //     ),
            //   ),
          )
        : SizedBox(
            height: height ?? 50,
            width: width ?? AppSize.size.width,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                elevation: 5,
                backgroundColor: color ?? AppColors.white,
                foregroundColor: AppColors.black,
              ),
              onPressed: onTap,
              child: AppText(
                data: text ?? "Text Here...",
                color: textColor ?? AppColors.black,
                fontWeight: fontWeight ?? FontWeight.w900,
                fontSize: fontSize ?? 16,
              ),
            ),
          );

    //  Padding(
    //     padding: EdgeInsets.all(padding ?? 20),
    //     child: GestureDetector(
    //       onTap: onTap,
    //       child: Container(
    //         width: width ?? Get.width,
    //         height: height ?? AppSize.width(value: 50.0),
    //         alignment: Alignment.center,
    //         decoration: BoxDecoration(
    //           color: color,
    //           // gradient: gradient ?? AppColors.gradientColors,
    //           // color: AppColors.deepWhte,
    //           borderRadius: BorderRadius.circular(
    //             borderRadius ?? AppSize.width(value: 8),
    //           ),
    //         ),
    //         child: AppText(
    //           data: text ?? "Text Here....",
    //           fontSize: fontSize ?? 18,
    //           color: textColor ?? AppColors.primary,
    //           fontWeight: fontWeight ?? FontWeight.w600,
    //         ),
    //       ),
    //     ),
    // );
  }
}
