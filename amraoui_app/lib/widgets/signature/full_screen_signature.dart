import 'package:flutter/material.dart';
import 'package:signature/signature.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';

class FullScreenSignature extends StatefulWidget {
  final String title;

  const FullScreenSignature({super.key, required this.title});

  @override
  State<FullScreenSignature> createState() => _FullScreenSignatureState();
}

class _FullScreenSignatureState extends State<FullScreenSignature> {
  final SignatureController _controller = SignatureController(
    penStrokeWidth: 4,
    penColor: Colors.black,
    exportBackgroundColor: Colors.white,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black),
          onPressed: () => Get.back(),
        ),
        title: AppText(
          data: widget.title,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
        actions: [
          TextButton(
            onPressed: () => _controller.clear(),
            child: const AppText(
              data: 'Clear',
              color: Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
          TextButton(
            onPressed: () {
              if (_controller.isNotEmpty) {
                Get.back(result: _controller.points);
              } else {
                Get.snackbar(
                  'Empty',
                  'Please draw a signature first.',
                  backgroundColor: Colors.white,
                );
              }
            },
            child: const AppText(
              data: 'Done',
              color: Color(0xFF2563EB),
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Container(
          margin: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            border: Border.all(color: const Color(0xFFCBD5E1), width: 2),
            borderRadius: BorderRadius.circular(16),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Signature(
              controller: _controller,
              backgroundColor: const Color(0xFFF8FAFC),
            ),
          ),
        ),
      ),
    );
  }
}
