import 'package:flutter/material.dart';

class CustomShapeClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    final path = Path();
    path.moveTo(0, size.height * 0.3); // Start below the top
    path.quadraticBezierTo(
      size.width / 2,
      0, // Peak of the curve at the top
      size.width,
      size.height * 0.1, // End of the curve
    );
    path.lineTo(size.width, size.height); // Draw to bottom-right
    path.lineTo(0, size.height); // Draw to bottom-left
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => true;
}
