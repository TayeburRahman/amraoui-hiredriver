import 'dart:io';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:amraoui_app/const/utils/app_colors.dart';
import '../../const/api_url/api_url.dart';
import '../../utils/app_size.dart';
import '../log_print/app_log.dart';

class AppImage extends StatelessWidget {
  const AppImage({
    super.key,
    this.color = Colors.grey,
    this.fit = BoxFit.cover,
    this.height,
    this.path = "",
    this.url = "",
    this.width,
    this.filePath = "",
    this.iconColor,
    this.isFullScreen = false,
  });

  final String path;
  final String filePath;
  final String url;
  final BoxFit? fit;
  final double? width;
  final double? height;
  final Color color;
  final Color? iconColor;
  final bool isFullScreen;

  @override
  Widget build(BuildContext context) {
    // File image
    if (filePath.isNotEmpty) {
      return GestureDetector(
        onTap: isFullScreen
            ? () {
                if (isFullScreen) {
                  _showFullScreenImage(
                    context,
                    Image.file(
                      File(filePath),
                      width: width,
                      height: height,
                      fit: fit,
                      errorBuilder: (context, error, stackTrace) {
                        appLog("Error loading file image: $error");
                        return _errorPlaceholder();
                      },
                    ),
                  );
                }
              }
            : null,
        child: Image.file(
          File(filePath),
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (context, error, stackTrace) {
            appLog("Error loading file image: $error");
            return _errorPlaceholder();
          },
        ),
      );
    }

    // Network image
    if (url.isNotEmpty && !url.toLowerCase().startsWith("null")) {
      return GestureDetector(
        onTap: isFullScreen
            ? () {
                if (isFullScreen) {
                  _showFullScreenImage(
                    context,
                    NetworkImageWithRetry(
                      key: ValueKey(
                        url,
                      ), // Ensures unique rebuild for each image URL

                      imageUrl: url,
                      width: width,
                      height: height,
                      fit: fit,
                    ),
                  );
                }
              }
            : null,
        child: NetworkImageWithRetry(
          key: ValueKey(url), // Ensures unique rebuild for each image URL

          imageUrl: url,
          width: width,
          height: height,
          fit: fit,
        ),
      );
    }

    // Asset image
    if (path.isNotEmpty) {
      return GestureDetector(
        onTap: isFullScreen
            ? () {
                if (isFullScreen) {
                  _showFullScreenImage(
                    context,
                    Image.asset(
                      path,
                      width: width,
                      height: height,
                      fit: fit,
                      color: iconColor,
                      errorBuilder: (context, error, stackTrace) {
                        appLog("Error loading asset image: $error");
                        return _errorPlaceholder();
                      },
                    ),
                  );
                }
              }
            : null,
        child: Image.asset(
          path,
          width: width,
          height: height,
          fit: fit,
          color: iconColor,
          errorBuilder: (context, error, stackTrace) {
            appLog("Error loading asset image: $error");
            return _errorPlaceholder();
          },
        ),
      );
    }

    // Default placeholder
    return _errorPlaceholder();
  }

  Widget _errorPlaceholder() {
    return Container(
      width: width,
      height: height,
      color: color,
      child: Image.asset(
        "assets/images/network_placeholder_image.jpg",
        width: width,
        height: height,
        fit: BoxFit.fill,
      ),
      // child: const Center(child: Icon(Icons.image_not_supported)),
    );
  }

  void _showFullScreenImage(BuildContext context, Widget imageWidget) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FullScreenImageViewer(image: imageWidget),
      ),
    );
  }
}

class FullScreenImageViewer extends StatefulWidget {
  final Widget image;

  const FullScreenImageViewer({super.key, required this.image});

  @override
  State<FullScreenImageViewer> createState() => _FullScreenImageViewerState();
}

class _FullScreenImageViewerState extends State<FullScreenImageViewer>
    with SingleTickerProviderStateMixin {
  late AnimationController animationController;
  Animation<Matrix4>? zoomAnimation;
  late TransformationController transformationController;
  TapDownDetails? doubleTapDetails;

  void onAppInitial() {
    try {
      transformationController = TransformationController();

      animationController =
          AnimationController(
            vsync: this,
            duration: const Duration(milliseconds: 300),
          )..addListener(() {
            transformationController.value = zoomAnimation!.value;
          });
    } catch (e) {
      appLog("onAppInitial $e");
    }
  }

  void handleDoubleTapDown(TapDownDetails details) {
    doubleTapDetails = details;
  }

  void handleDoubleTap() {
    final newValue = transformationController.value.isIdentity()
        ? _applyZoom()
        : _revertZoom();

    zoomAnimation = Matrix4Tween(
      begin: transformationController.value,
      end: newValue,
    ).animate(CurveTween(curve: Curves.ease).animate(animationController));
    animationController.forward(from: 0);
  }

  Matrix4 _applyZoom() {
    final tapPosition = doubleTapDetails!.localPosition;
    final zoomed = Matrix4.identity()
      ..translateByDouble(-tapPosition.dx, -tapPosition.dy, 0.0, 0.0)
      ..scaleByDouble(2.0, 2.0, 1.0, 1.0);
    return zoomed;
  }

  Matrix4 _revertZoom() => Matrix4.identity();

  void appClose() {
    try {
      transformationController.dispose();
      animationController.dispose();
    } catch (e) {
      appLog("appClose $e");
    }
  }

  @override
  void initState() {
    onAppInitial();
    super.initState();
  }

  @override
  void dispose() {
    appClose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: GestureDetector(
        onDoubleTapDown: handleDoubleTapDown,
        onDoubleTap: handleDoubleTap,
        child: InteractiveViewer(
          panAxis: PanAxis.aligned,
          transformationController: transformationController,
          maxScale: 10.0,
          minScale: 1,
          child: Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: AppSize.size.height * 0.4,
                minWidth: AppSize.size.width,
              ),
              child: widget.image,
            ),
          ),
        ),
      ),
    );
  }
}

class NetworkImageWithRetry extends StatefulWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit? fit;

  const NetworkImageWithRetry({
    super.key,
    required this.imageUrl,
    this.fit,
    this.height,
    this.width,
  });

  @override
  State<NetworkImageWithRetry> createState() => _NetworkImageWithRetryState();
}

class _NetworkImageWithRetryState extends State<NetworkImageWithRetry> {
  int retryCount = 0;
  final int maxRetries = 2;
  late String _image;
  late bool isMounted;

  @override
  void initState() {
    super.initState();
    isMounted = mounted;
    _setImage();
  }

  @override
  void didUpdateWidget(covariant NetworkImageWithRetry oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.imageUrl.toLowerCase() != widget.imageUrl.toLowerCase()) {
      retryCount = 0; // Reset retries for the new URL
      _setImage();
      if (mounted) setState(() {});
    }
  }

  void _setImage() {
    try {
      final uri = Uri.tryParse(widget.imageUrl);
      if (uri != null && (uri.isScheme('http') || uri.isScheme('https'))) {
        _image = widget.imageUrl;
      } else if (widget.imageUrl.runtimeType == Null) {
        _image = "";
      } else {
        _image = "${AppApiUrl.domain}${widget.imageUrl}";
      }
    } catch (e) {
      appLog("Error setting image URL: $e");
      _image = widget.imageUrl;
    }
  }

  void _retry() async {
    if (retryCount < maxRetries) {
      WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
        await Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            setState(() {
              retryCount++;
            });
          }
        });
      });
    } else {
      appLog("Max retries reached for image: $_image");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Image(
      image: CachedNetworkImageProvider(_image),
      width: widget.width,
      height: widget.height,
      fit: widget.fit,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return _loadingPlaceholder();
      },
      errorBuilder: (context, error, stackTrace) {
        appLog("Network image error: $error");
        _retry();
        return _errorPlaceholder();
      },
    );
  }

  Widget _loadingPlaceholder() {
    return Container(
      width: widget.width,
      height: widget.height,
      color: AppColors.primary,
      child: const Center(
        child: CupertinoActivityIndicator(color: AppColors.primary),
      ),
    );
  }

  Widget _errorPlaceholder() {
    return Container(
      width: widget.width,
      height: widget.height,
      color: Colors.grey,
      child: Image.asset(
        "assets/images/network_placeholder_image.jpg",
        width: widget.width,
        height: widget.height,
        fit: BoxFit.fill,
      ),
    );
  }
}
