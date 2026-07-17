import 'package:flutter/material.dart';
import 'package:Vehiqqo/widgets/log_print/error_log.dart';
import 'package:get/get.dart';

Future<void> customTimePicker({
  required Function(TimeOfDay) onCallTimePick,
}) async {
  try {
    var response = await showTimePicker(
      // barrierColor: Colors.red,
      context: Get.context!,
      initialTime: TimeOfDay.now(),
    );
    if (response != null) {
      onCallTimePick(response);
    }
  } catch (e) {
    errorLog("customTimePicker", e);
  }
}
