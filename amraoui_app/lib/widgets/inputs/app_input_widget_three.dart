import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import 'package:amraoui_app/utils/app_size.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';

class AppInputWidgetThree extends StatefulWidget {
  const AppInputWidgetThree({
    super.key,
    this.title = "",
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
    this.border,
    this.errBorder,
    this.titleColor,
    this.onTap,
    this.style,
    this.secondController,
    // this.onTapOutside,
  });
  final String title;
  final String hintText;
  final Widget? prefix;
  final Widget? suffixIcon;
  final bool isPassWord;
  final bool readOnly;
  final bool isEmail;
  final TextInputAction? textInputAction;
  final TextEditingController? controller;
  final TextEditingController? secondController;
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
  // final void Function(PointerDownEvent)? onTapOutside;
  final TextStyle? style;

  @override
  State<AppInputWidgetThree> createState() => _AppInputWidgetThreeState();
}

class _AppInputWidgetThreeState extends State<AppInputWidgetThree> {
  bool isShowPassWord = true;
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Gap(height: 15),
        widget.title == ""
            ? const SizedBox()
            : AppText(
                data: widget.title,
                fontWeight: FontWeight.w500,
                color: widget.titleColor ?? AppColors.primary,
              ),
        const Gap(height: 10),
        Material(
          elevation: widget.elevation,
          shadowColor: widget.elevationColor,
          borderOnForeground: false,
          borderRadius: BorderRadius.circular(AppSize.width(value: 10.0)),
          color: Colors.transparent,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(AppSize.width(value: 10.0)),
            child: TextFormField(
              onTapOutside: ((ajay) {
                FocusScope.of(context).unfocus();
              }),
              onTap: widget.onTap,
              readOnly: widget.readOnly,
              controller: widget.controller,
              minLines: widget.minLines,
              maxLines: widget.maxLines,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return "This field is required";
                }
                if (widget.isPassWord && value.length < 8) {
                  return "Must be at last 8 characters.";
                }
                if (widget.isEmail) {
                  if (value.toString().isEmail) return null;
                  return "Please provide valid email address";
                }
                if (widget.secondController != null) {
                  if (value.toLowerCase() !=
                      widget.secondController!.text.toLowerCase()) {
                    return "Both passwords most match";
                  } else {
                    return null;
                  }
                }

                return null;
              },
              keyboardType: widget.keyboardType,
              textInputAction: widget.textInputAction,
              obscureText: widget.isPassWord && isShowPassWord,
              obscuringCharacter: "*",
              textAlignVertical: TextAlignVertical.center,
              style: widget.style,
              decoration: InputDecoration(
                filled: true,
                fillColor: widget.fillColor ?? Colors.white60.withOpacity(0.3),
                prefixIcon: widget.prefix,
                suffixIcon: widget.isPassWord
                    ? Container(
                        margin: const EdgeInsets.all(5),
                        width: 10,
                        height: 10,
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
                              ? const Icon(Icons.visibility)
                              : const Icon(Icons.visibility_off),
                        ),
                      )
                    : widget.suffixIcon,
                hintText: widget.hintText.tr,
                hintStyle: Theme.of(
                  context,
                ).textTheme.titleSmall?.copyWith(color: AppColors.primary),
                border: widget.border ?? InputBorder.none,
                enabledBorder: widget.border ?? InputBorder.none,
                focusedBorder: widget.border ?? InputBorder.none,
                errorBorder: widget.errBorder ?? InputBorder.none,
                focusedErrorBorder: widget.errBorder ?? InputBorder.none,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class AppInputWidgetFour extends StatefulWidget {
  const AppInputWidgetFour({
    super.key,
    this.title = "",
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
    this.border,
    this.errBorder,
    this.titleColor,
    this.onTap,
    this.style,
    this.secondController,
    this.onTapOutside,
    this.hintColor,
    this.focusNode,
    this.onFieldSubmitted,
    this.onChanged,
    this.suffixIconConstraints,
    this.constraints,
    this.isDense,
    this.isCollapsed,
  });
  final String title;
  final String hintText;
  final Widget? prefix;
  final Widget? suffixIcon;
  final bool isPassWord;
  final bool readOnly;
  final bool isEmail;
  final TextInputAction? textInputAction;
  final TextEditingController? controller;
  final TextEditingController? secondController;
  final TextInputType? keyboardType;
  final Color? fillColor;
  final Color? titleColor;
  final double elevation;
  final Color? elevationColor;
  final Color? hintColor;
  final int minLines;
  final int? maxLines;
  final InputBorder? border;
  final InputBorder? errBorder;
  final void Function()? onTap;
  final void Function(PointerDownEvent)? onTapOutside;
  final TextStyle? style;
  final FocusNode? focusNode;
  final void Function(String)? onFieldSubmitted;
  final void Function(String)? onChanged;
  final BoxConstraints? suffixIconConstraints;
  final BoxConstraints? constraints;
  final bool? isDense;
  final bool? isCollapsed;
  @override
  State<AppInputWidgetFour> createState() => _AppInputWidgetFourState();
}

class _AppInputWidgetFourState extends State<AppInputWidgetFour> {
  bool isShowPassWord = true;
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Gap(height: 15),
        widget.title == ""
            ? const SizedBox()
            : AppText(
                data: widget.title,
                fontWeight: FontWeight.w500,
                color: widget.titleColor ?? Colors.white60,
              ),
        widget.title == "" ? const SizedBox() : const Gap(height: 10),
        Material(
          elevation: widget.elevation,
          shadowColor: widget.elevationColor,
          borderOnForeground: false,
          borderRadius: BorderRadius.circular(AppSize.width(value: 15.0)),
          color: Colors.transparent,
          child: TextFormField(
            onChanged: widget.onChanged,
            onFieldSubmitted: widget.onFieldSubmitted,
            focusNode: widget.focusNode,
            onTapOutside: widget.onTapOutside,
            onTap: widget.onTap,
            readOnly: widget.readOnly,
            controller: widget.controller,
            minLines: widget.minLines,
            maxLines: widget.maxLines,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return "This field is required";
              }
              if (widget.isPassWord && value.length < 8) {
                return "Must be at last 8 characters.";
              }
              if (widget.isEmail) {
                if (value.toString().isEmail) return null;
                return "Please provide valid email address";
              }
              if (widget.secondController != null) {
                if (value.toLowerCase() !=
                    widget.secondController!.text.toLowerCase()) {
                  return "Both passwords most match";
                } else {
                  return null;
                }
              }

              return null;
            },
            keyboardType: widget.keyboardType,
            textInputAction: widget.textInputAction,
            obscureText: widget.isPassWord && isShowPassWord,
            obscuringCharacter: "*",
            textAlignVertical: TextAlignVertical.center,
            style: widget.style,
            decoration: InputDecoration(
              constraints: widget.constraints,
              isDense: widget.isDense,
              isCollapsed: widget.isCollapsed,
              filled: true,
              fillColor: widget.fillColor ?? Colors.white60.withOpacity(0.3),
              prefixIcon: widget.prefix,
              suffixIconConstraints: widget.suffixIconConstraints,
              suffixIcon: widget.isPassWord
                  ? Container(
                      margin: const EdgeInsets.all(5),
                      width: 10,
                      height: 10,
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
                            ? const Icon(Icons.visibility)
                            : const Icon(Icons.visibility_off),
                      ),
                    )
                  : widget.suffixIcon,
              hintText: widget.hintText,
              hintStyle: Theme.of(context).textTheme.titleSmall?.copyWith(
                color: widget.hintColor ?? Colors.white60,
              ),
              border: widget.border ?? InputBorder.none,
              enabledBorder: widget.border ?? InputBorder.none,
              focusedBorder: widget.border ?? InputBorder.none,
              errorBorder: widget.errBorder ?? InputBorder.none,
              focusedErrorBorder: widget.errBorder ?? InputBorder.none,
            ),
          ),
        ),
      ],
    );
  }
}
