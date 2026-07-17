import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:Vehiqqo/const/app_const/app_const.dart';
import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/utils/app_size.dart';

class AppInputWidgetTwo extends StatefulWidget {
  const AppInputWidgetTwo({
    super.key,
    this.hintText,
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
    this.readOnly = false,
    this.border,
    this.errBorder,
    this.borderRadius,
    this.contentPadding,
    this.style,
    this.maxLines,
    this.onFieldSubmitted,
    this.onTap,
    this.filled = true,
    this.prefixIconConstraints,
    this.textAlignVertical,
    this.suffixIconConstraints,
    this.onChanged,
    this.isPassWordSecondValidation = false,
    this.isOptional = false,
    this.isPassWordSecondValidationController,
    this.focusNode,
    this.cursorColor,
    this.inputFormatters,
  });

  final String? hintText;
  final Widget? prefix;
  final Widget? suffixIcon;
  final bool isPassWord;
  final bool readOnly;
  final bool isEmail;
  final TextInputAction? textInputAction;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final Color? fillColor;
  final bool filled;
  final double elevation;
  final Color? elevationColor;
  final int minLines;
  final int? maxLines;
  final InputBorder? border;
  final InputBorder? errBorder;
  final double? borderRadius;
  final EdgeInsetsGeometry? contentPadding;
  final TextStyle? style;
  final BoxConstraints? prefixIconConstraints;
  final BoxConstraints? suffixIconConstraints;
  final void Function(String)? onFieldSubmitted;
  final void Function()? onTap;
  final void Function(String)? onChanged;
  final TextAlignVertical? textAlignVertical;
  final bool isPassWordSecondValidation;
  final bool isOptional;
  final TextEditingController? isPassWordSecondValidationController;
  final FocusNode? focusNode;
  final Color? cursorColor;
  final List<TextInputFormatter>? inputFormatters;

  @override
  State<AppInputWidgetTwo> createState() => _AppInputWidgetTwoState();
}

class _AppInputWidgetTwoState extends State<AppInputWidgetTwo> {
  bool isShowPassWord = true;
  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: widget.elevation,
      shadowColor: widget.elevationColor,
      borderOnForeground: false,
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(
        AppSize.width(value: widget.borderRadius ?? 8.0),
      ),
      child: TextFormField(
        // onTapOutside: (event) {
        //   FocusManager.instance.primaryFocus?.unfocus();
        // },
        inputFormatters: widget.inputFormatters,
        cursorColor: widget.cursorColor ?? Colors.black,
        focusNode: widget.focusNode,
        onChanged: widget.onChanged,
        onTap: widget.onTap,
        onFieldSubmitted: widget.onFieldSubmitted,
        readOnly: widget.readOnly,
        controller: widget.controller,
        minLines: widget.minLines,
        maxLines: (widget.isPassWord && isShowPassWord) ? 1 : widget.maxLines,
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
            const pattern =
                r"(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'"
                r'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-'
                r'\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*'
                r'[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4]'
                r'[0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9]'
                r'[0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\'
                r'x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])';
            final regex = RegExp(pattern);
            if (regex.hasMatch(value)) return null;
            return "Please provide valid email address";
          }
          if (widget.isPassWord && widget.isPassWordSecondValidation) {
            if (widget.isPassWordSecondValidationController != null) {
              if (value.toLowerCase() !=
                  widget.isPassWordSecondValidationController!.text
                      .toLowerCase()) {
                return "Both password most match";
              } else {
                return null;
              }
            }
          }

          return null;
        },
        keyboardType: widget.keyboardType,
        textInputAction: widget.textInputAction,
        obscureText: widget.isPassWord && isShowPassWord,
        obscuringCharacter: "*",
        textAlignVertical: widget.textAlignVertical ?? TextAlignVertical.center,
        style:
            widget.style ??
            const TextStyle(
              height: 1.5,
              fontFamily: AppConst.manrope,
              fontWeight: FontWeight.w500,
              color: AppColors.black,
            ),
        decoration: InputDecoration(
          errorStyle: const TextStyle(backgroundColor: Colors.white60),
          contentPadding:
              widget.contentPadding ??
              EdgeInsets.all(AppSize.width(value: 12.0)),
          filled: widget.filled,
          fillColor: widget.fillColor ?? Colors.white60.withOpacity(0.3),
          prefixIcon: widget.prefix != null
              ? Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: AppSize.width(value: 12),
                  ),
                  child: widget.prefix,
                )
              : null,
          suffixIcon: widget.isPassWord
              ? Container(
                  margin: EdgeInsets.only(right: AppSize.width(value: 10)),
                  width: AppSize.width(value: 20),
                  height: AppSize.width(value: 20),
                  alignment: Alignment.centerLeft,
                  child: IconButton(
                    color: AppColors.primary,
                    padding: EdgeInsets.zero,
                    // highlightColor: Colors.black.withOpacity(.2),
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
              : widget.suffixIcon != null
              ? Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: AppSize.width(value: 12),
                  ),
                  child: widget.suffixIcon,
                )
              : null,
          hintText: widget.hintText ?? "",
          hintStyle: Theme.of(
            context,
          ).textTheme.titleSmall?.copyWith(color: AppColors.primary),
          prefixIconConstraints:
              widget.prefixIconConstraints ??
              BoxConstraints(
                maxWidth: AppSize.width(value: 50),
                maxHeight: AppSize.width(value: 40),
              ),
          suffixIconConstraints:
              widget.suffixIconConstraints ??
              BoxConstraints(
                maxWidth: AppSize.width(value: 40),
                maxHeight: AppSize.width(value: 40),
              ),
          border:
              widget.border ??
              OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.white60),
                borderRadius: BorderRadius.circular(
                  AppSize.width(value: widget.borderRadius ?? 8.0),
                ),
              ),
          enabledBorder:
              widget.border ??
              OutlineInputBorder(
                borderSide: const BorderSide(
                  color: Color(0xffCACACA),
                ), // This is the main Border Colors
                borderRadius: BorderRadius.circular(
                  AppSize.width(value: widget.borderRadius ?? 8.0),
                ),
              ),
          focusedBorder:
              widget.border ??
              OutlineInputBorder(
                borderSide: const BorderSide(color: Color(0xffCACACA)),
                borderRadius: BorderRadius.circular(
                  AppSize.width(value: widget.borderRadius ?? 8.0),
                ),
              ),
          errorBorder:
              widget.errBorder ??
              OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.red),
                borderRadius: BorderRadius.circular(
                  AppSize.width(value: widget.borderRadius ?? 8.0),
                ),
              ),
          focusedErrorBorder:
              widget.errBorder ??
              OutlineInputBorder(
                borderSide: const BorderSide(color: AppColors.primary),
                borderRadius: BorderRadius.circular(
                  AppSize.width(value: widget.borderRadius ?? 8.0),
                ),
              ),
        ),
      ),
    );
  }
}
