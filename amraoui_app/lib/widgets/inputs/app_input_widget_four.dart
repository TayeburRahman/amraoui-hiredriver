import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/const/app_const/app_const.dart';
import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';

class AppInputWidgetFive extends StatefulWidget {
  const AppInputWidgetFive({
    super.key,
    this.title,
    this.subTitle,
    this.hintText = "",
    this.prefix,
    this.suffixIcon,
    this.isPassWord = false,
    this.isEmail = false,
    this.textInputAction = TextInputAction.next,
    this.controller,
    this.keyboardType,
    this.fillColor,
    this.elevation = 0.0,
    this.elevationColor,
    this.minLines = 1,
    this.maxLines,
    this.readOnly = false,
    this.isOptional = false,
    this.border,
    this.errBorder,
    this.titleColor,
    this.onTap,
    this.style,
    this.hintStyle,
    this.padding,
    this.contentPadding,
    this.isPassWordSecondValidation = false,
    this.isPassWordSecondValidationController,
    this.textAlign = TextAlign.start,
    this.suffixIconConstraints,
    this.inputFormatters,
    this.onChanged,
    this.onFieldSubmitted,
  });
  final String? title;
  final String? subTitle;
  final String hintText;
  final Widget? prefix;
  final Widget? suffixIcon;
  final bool isPassWord;
  final bool readOnly;
  final bool isEmail;
  final bool isOptional;
  final TextInputAction? textInputAction;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final Color? fillColor;
  final Color? titleColor;
  final double elevation;
  final Color? elevationColor;
  final int minLines;
  final int? maxLines;
  final InputBorder? border;
  final InputBorder? errBorder;
  final void Function()? onTap;
  final TextStyle? style;
  final TextStyle? hintStyle;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? contentPadding;
  final bool isPassWordSecondValidation;
  final TextEditingController? isPassWordSecondValidationController;
  final TextAlign textAlign;
  final BoxConstraints? suffixIconConstraints;
  final List<TextInputFormatter>? inputFormatters;
  final void Function(String)? onChanged;
  final void Function(String)? onFieldSubmitted;

  @override
  State<AppInputWidgetFive> createState() => _AppInputWidgetTwoState();
}

class _AppInputWidgetTwoState extends State<AppInputWidgetFive> {
  bool isShowPassWord = true;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          widget.padding ??
          EdgeInsets.symmetric(horizontal: AppSize.width(value: 20.0)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.title != null) const Gap(height: 15),
          if (widget.title != null)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                AppText(
                  data: widget.title ?? "",
                  fontWeight: FontWeight.w500,
                  color: widget.titleColor ?? Colors.white60,
                  fontSize: 18,
                ),
                Padding(
                  padding: EdgeInsets.only(right: AppSize.width(value: 10.0)),
                  child: AppText(
                    data: widget.subTitle ?? "",
                    fontWeight: FontWeight.w400,
                    color: widget.titleColor ?? Colors.white60,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          if (widget.title != null) const Gap(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppSize.width(value: 8.0)),
            child: TextFormField(
              cursorColor: AppColors.primary,
              onTap: widget.onTap,
              readOnly: widget.readOnly,
              controller: widget.controller,
              minLines: widget.minLines,
              maxLines: widget.maxLines,
              onChanged: widget.onChanged,
              onFieldSubmitted: widget.onFieldSubmitted,
              validator: (value) {
                if (widget.isOptional) {
                  return null;
                }
                if (value == null || value.isEmpty) {
                  return "This field is required";
                }
                if (widget.isPassWord && value.length < 8) {
                  return "Must be at last 8 characters.";
                }
                if (widget.isEmail) {
                  if (value.toString().isEmail) return null;
                  return "Please provide a valid email address";
                }
                if (widget.isPassWord && widget.isPassWordSecondValidation) {
                  if (widget.isPassWordSecondValidationController != null) {
                    if (value.toLowerCase() !=
                        widget.isPassWordSecondValidationController!.text
                            .toLowerCase()) {
                      return "Both passwords most match";
                    } else {
                      return null;
                    }
                  }
                }

                return null;
              },
              inputFormatters: widget.inputFormatters,
              keyboardType: widget.keyboardType,
              textInputAction: widget.textInputAction,
              obscureText: widget.isPassWord && isShowPassWord,
              obscuringCharacter: "*",
              textAlignVertical: TextAlignVertical.top,
              style:
                  widget.style ??
                  Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w400,
                    fontSize: 16,
                  ),
              textAlign: widget.textAlign,
              decoration: InputDecoration(
                filled: true,
                contentPadding:
                    widget.contentPadding ??
                    EdgeInsets.all(AppSize.width(value: 15.0)),
                fillColor: widget.fillColor ?? Colors.white60,
                prefixIcon: widget.prefix,
                suffixIcon: widget.isPassWord
                    ? Container(
                        margin: const EdgeInsets.all(5),
                        width: AppSize.width(value: 10),
                        height: AppSize.width(value: 10),
                        child: IconButton(
                          color: Colors.white60,
                          padding: EdgeInsets.zero,
                          highlightColor: Colors.white60,
                          onPressed: () {
                            setState(() {
                              isShowPassWord = !isShowPassWord;
                            });
                          },
                          icon: isShowPassWord
                              ? const Icon(Icons.visibility_off)
                              : const Icon(Icons.visibility),
                        ),
                      )
                    : widget.suffixIcon,
                suffixIconConstraints: widget.suffixIconConstraints,
                hintText: widget.hintText,
                hintStyle:
                    widget.hintStyle ??
                    Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: Colors.white60,
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                    ),
                errorStyle: const TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.w500,
                  fontFamily: AppConst.manrope,
                  fontSize: 14,
                ),
                border:
                    widget.border ??
                    OutlineInputBorder(
                      borderRadius: BorderRadius.circular(
                        AppSize.width(value: 8.0),
                      ),
                      borderSide: const BorderSide(color: Colors.white60),
                    ),
                enabledBorder:
                    widget.border ??
                    OutlineInputBorder(
                      borderRadius: BorderRadius.circular(
                        AppSize.width(value: 8.0),
                      ),
                      borderSide: const BorderSide(color: Colors.white60),
                    ),
                focusedBorder:
                    widget.border ??
                    OutlineInputBorder(
                      borderRadius: BorderRadius.circular(
                        AppSize.width(value: 8.0),
                      ),
                      borderSide: const BorderSide(color: Colors.white60),
                    ),
                errorBorder:
                    widget.errBorder ??
                    OutlineInputBorder(
                      borderRadius: BorderRadius.circular(
                        AppSize.width(value: 8.0),
                      ),
                      borderSide: const BorderSide(color: Colors.white60),
                    ),
                focusedErrorBorder:
                    widget.errBorder ??
                    OutlineInputBorder(
                      borderRadius: BorderRadius.circular(
                        AppSize.width(value: 8.0),
                      ),
                      borderSide: const BorderSide(color: Colors.white60),
                    ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
