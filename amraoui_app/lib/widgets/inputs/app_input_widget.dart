import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/const/app_const/app_const.dart';
import 'package:Vehiqqo/utils/app_size.dart';

class AppInputWidget extends StatefulWidget {
  const AppInputWidget({
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
    this.maxLines = 1,
    this.onFieldSubmitted,
    this.onTap,
    this.filled = true,
    this.prefixIconConstraints,
    this.suffixIconConstraints,
    this.cursorColor,
    this.onTapOutside,
    this.textAlignVertical = TextAlignVertical.top,
    this.focusNode,
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
  final BorderRadiusGeometry? borderRadius;
  final EdgeInsetsGeometry? contentPadding;
  final TextStyle? style;
  final void Function(String)? onFieldSubmitted;
  final void Function()? onTap;
  final BoxConstraints? prefixIconConstraints;
  final BoxConstraints? suffixIconConstraints;
  final TextAlignVertical textAlignVertical;
  final Color? cursorColor;
  final void Function(PointerDownEvent)? onTapOutside;
  final FocusNode? focusNode;

  @override
  State<AppInputWidget> createState() => _AppInputWidgetState();
}

class _AppInputWidgetState extends State<AppInputWidget> {
  bool isShowPassWord = true;
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius:
          widget.borderRadius ??
          BorderRadius.circular(AppSize.width(value: 8.0)),
      child: Material(
        elevation: widget.elevation,
        shadowColor: widget.elevationColor,
        borderOnForeground: false,
        color: Colors.transparent,
        borderRadius:
            widget.borderRadius ??
            BorderRadius.circular(AppSize.width(value: 8.0)),
        child: TextFormField(
          focusNode: widget.focusNode,
          cursorColor: widget.cursorColor,
          // onTapOutside: widget.onTapOutside ??
          //     ((ajay) {
          //       FocusScope.of(context).unfocus();
          //     }),
          onTap: widget.onTap,
          onFieldSubmitted: widget.onFieldSubmitted,
          readOnly: widget.readOnly,
          controller: widget.controller,
          minLines: widget.minLines,
          maxLines: widget.isPassWord ? 1 : widget.maxLines,
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

            return null;
          },
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          obscureText: widget.isPassWord && isShowPassWord,
          obscuringCharacter: "*",
          textAlignVertical: widget.textAlignVertical,
          style:
              widget.style ??
              const TextStyle(
                height: 1.5,
                fontFamily: AppConst.manrope,
                fontWeight: FontWeight.w500,
              ),
          decoration: InputDecoration(
            contentPadding:
                widget.contentPadding ??
                EdgeInsets.symmetric(
                  vertical: AppSize.height(value: 16),
                  horizontal: AppSize.width(value: 12),
                ),
            filled: widget.filled,
            fillColor: widget.fillColor ?? const Color(0xFFF8FAFC),
            prefixIcon: widget.prefix,
            prefixIconConstraints: widget.prefixIconConstraints,
            suffixIconConstraints: widget.suffixIconConstraints,
            suffixIcon: widget.isPassWord
                ? IconButton(
                    icon: Icon(
                      isShowPassWord
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: const Color(0xFF94A3B8),
                      size: 20,
                    ),
                    onPressed: () {
                      setState(() {
                        isShowPassWord = !isShowPassWord;
                      });
                    },
                  )
                : widget.suffixIcon,
            hintText: widget.hintText?.tr ?? "",
            hintStyle: Theme.of(context).textTheme.titleSmall?.copyWith(
              color: const Color(0xFF94A3B8),
              fontSize: 14,
            ),
            border:
                widget.border ??
                OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
            enabledBorder:
                widget.border ??
                OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
            focusedBorder:
                widget.border ??
                OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF2563EB)),
                ),
            errorBorder:
                widget.errBorder ??
                OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.red),
                ),
            focusedErrorBorder:
                widget.errBorder ??
                OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.red),
                ),
          ),
        ),
      ),
    );
  }
}
