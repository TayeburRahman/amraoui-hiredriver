import 'dart:developer';
import 'dart:io';
import 'package:amraoui_app/const/api_url/api_url.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AppImageCircular extends StatelessWidget {
  const AppImageCircular({
    super.key,
    this.color = Colors.blue,
    this.fit = BoxFit.fill,
    this.height,
    this.path, // >>>>>>>>>>>>>>>>>>>>>> parameter accept this data  <<<<<<<<<<<<<<<<<<<<<<
    this.url,
    this.width,
    this.filePath,
    this.borderRadius = 100,
  });
  final String? path;
  final String? filePath;
  final String? url;
  final BoxFit? fit;
  final double?
      width; // >>>>>>>>>>>>>>>>>>>>>> width and height provide by default size when parameter not provide <<<<<<<<<<<<<<<<<<<<<<
  final double? height;
  final double borderRadius;
  final Color color;

  @override
  Widget build(BuildContext context) {
    // >>>>>>>>>>>>>>>>>>>>>> file image is first <<<<<<<<<<<<<<<<<<<<<<
    if (filePath != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: Image.network(
          "${File(filePath!)}",
          width: width,
          height: height,
          fit: fit,
          // >>>>>>>>>>>>>>>>>>>>>> when load fail image  <<<<<<<<<<<<<<<<<<<<<<
          errorBuilder: (context, error, stackTrace) {
            return ClipRRect(
              borderRadius: BorderRadius.circular(borderRadius),
              child: Container(
                width: width,
                height: height,
                color: Colors.white60,
              ),
            );
          },
        ),
      );
    }

    // >>>>>>>>>>>>>>>>>>>>>> second network image  <<<<<<<<<<<<<<<<<<<<<<
    if (url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: Image.network(
          // url!,
          "${AppApiUrl.domain}$url",
          // url!,
          width: width,
          height: height,
          fit: fit,
          // >>>>>>>>>>>>>>>>>>>>>> when load fail image  <<<<<<<<<<<<<<<<<<<<<<
          errorBuilder: (context, error, stackTrace) {
            return ClipRRect(
              borderRadius: BorderRadius.circular(borderRadius),
              child: Container(
                width: width,
                height: height,
                color: Colors.white60,
              ),
            );
          },
          // >>>>>>>>>>>>>>>>>>>>>> when image is loading <<<<<<<<<<<<<<<<<<<<<<
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) {
              return child;
            }
            return ClipRRect(
              borderRadius: BorderRadius.circular(borderRadius),
              child: Container(
                width: width,
                height: height,
                color: Colors.white60,
                child: const SizedBox(
                  width: 50,
                  height: 50,
                  child: CupertinoActivityIndicator(
                    color: Colors.black,
                  ),
                ),
              ),
            );
          },
        ),
      );
    }
// >>>>>>>>>>>>>>>>>>>>>> thread local image or assets <<<<<<<<<<<<<<<<<<<<<<
    if (path != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: Image.asset(
          path!,
          width: width,
          height: height,
          fit: fit,
          // >>>>>>>>>>>>>>>>>>>>>> when load fail image  <<<<<<<<<<<<<<<<<<<<<<
          errorBuilder: (context, error, stackTrace) {
            log("image load error : $error");
            return ClipRRect(
              borderRadius: BorderRadius.circular(borderRadius),
              child: Container(
                width: width,
                height: height,
                color: Colors.white60,
              ),
            );
          },
        ),
      );
    }
    // >>>>>>>>>>>>>>>>>>>>>>by default widget return  <<<<<<<<<<<<<<<<<<<<<<
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: Container(
        width: width,
        height: height,
        color: color,
      ),
    );
  }
}
