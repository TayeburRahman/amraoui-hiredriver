import 'package:flutter/material.dart';
import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';

class CustomDropDownButton<T> extends StatefulWidget {
  const CustomDropDownButton({
    super.key,
    this.dropDownValueList = const [],
    this.dropDownChildList = const [],
    required this.onChange,
    this.hintText = "",
    this.value,
    this.title = "",
    this.validatorText = "",
  });

  final List<T> dropDownValueList;
  final List<DropdownMenuItem<T>> dropDownChildList;
  final T? value;
  final String hintText;
  final String validatorText;
  final Function(T onChange) onChange;
  final String title;

  @override
  State<CustomDropDownButton<T>> createState() =>
      _CustomDropDownButtonState<T>();
}

class _CustomDropDownButtonState<T> extends State<CustomDropDownButton<T>> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    // Determine the current display text
    String displayText = widget.hintText;
    if (widget.value != null) {
      if (widget.dropDownChildList.isNotEmpty) {
        try {
          final selectedItem = widget.dropDownChildList.firstWhere(
            (item) => item.value == widget.value,
            orElse: () => widget.dropDownChildList.first,
          );
          if (selectedItem.child is Text) {
            displayText =
                (selectedItem.child as Text).data ?? widget.value.toString();
          } else if (selectedItem.child is AppText) {
            displayText = (selectedItem.child as AppText).data;
          } else {
            displayText = widget.value.toString();
          }
        } catch (_) {
          displayText = widget.value.toString();
        }
      } else {
        displayText = widget.value.toString();
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.title.isNotEmpty) const Gap(height: 10),
        if (widget.title.isNotEmpty)
          AppText(
            data: widget.title,
            fontSize: 16,
            color: const Color(0xff6D717F),
            fontWeight: FontWeight.w500,
          ),
        if (widget.title.isNotEmpty) const Gap(height: 10),
        GestureDetector(
          onTap: () {
            setState(() {
              _isExpanded = !_isExpanded;
            });
          },
          child: Container(
            height: 55,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FAFB),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: const Color(0xffE5E7EB)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: AppText(
                    data: displayText,
                    color: widget.value == null
                        ? const Color(0xFF9CA3AF)
                        : const Color(0xFF1F2937),
                    fontSize: 14,
                  ),
                ),
                Icon(
                  _isExpanded
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  color: const Color(0xFF9CA3AF),
                ),
              ],
            ),
          ),
        ),
        if (_isExpanded)
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            margin: const EdgeInsets.only(top: 8),
            constraints: const BoxConstraints(
              maxHeight: 300,
            ), // Added maxHeight to prevent overflow
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: const Color(0xffE5E7EB)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: SingleChildScrollView(
              // Added scroll view for large lists
              child: Column(children: _buildItems()),
            ),
          ),
      ],
    );
  }

  List<Widget> _buildItems() {
    if (widget.dropDownValueList.isNotEmpty) {
      return widget.dropDownValueList.map((T item) {
        return _buildItemWidget(item, item.toString());
      }).toList();
    } else {
      return widget.dropDownChildList.map((DropdownMenuItem<T> item) {
        String label = "";
        if (item.child is Text) {
          label = (item.child as Text).data ?? item.value.toString();
        } else if (item.child is AppText) {
          label = (item.child as AppText).data;
        } else {
          label = item.value.toString();
        }
        return _buildItemWidget(item.value as T, label);
      }).toList();
    }
  }

  Widget _buildItemWidget(T item, String label) {
    final isSelected = widget.value == item;
    return InkWell(
      onTap: () {
        widget.onChange(item);
        setState(() {
          _isExpanded = false;
        });
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withOpacity(0.05)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(15),
        ),
        child: AppText(
          data: label,
          fontSize: 14,
          color: isSelected ? AppColors.primary : const Color(0xFF1F2937),
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
}
