import 'package:flutter/material.dart';
import 'package:skeletonizer/skeletonizer.dart';

class AjayLoading extends StatelessWidget {
  final Widget child;
  final Widget loaderChild;
  final bool isLoading;
  const AjayLoading({
    super.key,
    required this.child,
    required this.loaderChild,
    required this.isLoading,
  });

  @override
  Widget build(BuildContext context) {
    return Skeletonizer(enabled: isLoading, child: isLoading ? loaderChild : child);
  }
}
