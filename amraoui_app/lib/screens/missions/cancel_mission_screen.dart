import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:amraoui_app/widgets/texts/app_text.dart';
import 'package:amraoui_app/utils/gap.dart';
import 'missions_screen.dart';
import 'cancel_success_screen.dart';

class CancelMissionScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  final String reqId;

  const CancelMissionScreen({
    super.key,
    required this.mission,
    required this.reqId,
  });

  @override
  State<CancelMissionScreen> createState() => _CancelMissionScreenState();
}

class _CancelMissionScreenState extends State<CancelMissionScreen> {
  final TextEditingController _reasonController = TextEditingController();
  final TextEditingController _noteController = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const AppText(data: 'Cancel Mission', color: Colors.black),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppText(
              data: 'Cancel Mission ${widget.reqId}',
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
            const Gap(height: 20),
            const AppText(data: 'Reason for Cancellation', fontWeight: FontWeight.bold),
            const Gap(height: 8),
            TextField(
              controller: _reasonController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'e.g., Driver unavailable, wrong address',
              ),
            ),
            const Gap(height: 20),
            const AppText(data: 'Additional Notes', fontWeight: FontWeight.bold),
            const Gap(height: 8),
            TextField(
              controller: _noteController,
              maxLines: 4,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Provide any additional details...',
              ),
            ),
            const Gap(height: 30),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _isLoading
                    ? null
                    : () async {
                        if (_reasonController.text.trim().isEmpty) {
                          Get.snackbar('Error', 'Please provide a reason');
                          return;
                        }

                        setState(() => _isLoading = true);

                        try {
                          final controller = Get.find<MissionsController>();
                          final success = await controller.cancelMission(
                            widget.mission['_id'],
                            _reasonController.text.trim(),
                            _noteController.text.trim(),
                          );

                          if (success) {
                            Get.off(() => CancelSuccessScreen(reqId: widget.reqId));
                          } else {
                            Get.snackbar('Error', 'Failed to cancel mission');
                          }
                        } finally {
                          if (mounted) setState(() => _isLoading = false);
                        }
                      },
                child: _isLoading
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const AppText(data: 'Confirm Cancellation', color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
