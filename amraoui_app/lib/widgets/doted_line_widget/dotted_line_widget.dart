// import 'package:dotted_line/dotted_line.dart';
// import 'package:flutter/material.dart';

// enum LineType { solid, dash }

// class TimeLineTile extends StatelessWidget {
//   final double? lineLength;
//   final double? dashLength;
//   final double? firstLineThickness;
//   final double? lastLineThickness;
//   final double? connectorThickness;
//   final double? connectorSize;
//   final int? value;
//   final Color? color;
//   final LineType? firstLineType;
//   final LineType? lastLineType;
//   final bool? isFirst;
//   final bool? isLast;
//   final Widget child;
//   const TimeLineTile({
//     super.key,
//     this.lineLength,
//     this.firstLineThickness,
//     this.dashLength,
//     this.color,
//     this.firstLineType,
//     this.lastLineType,
//     this.isFirst,
//     this.isLast,
//     this.lastLineThickness,
//     this.connectorSize,
//     this.value,
//     this.connectorThickness,
//     required this.child,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Row(
//       children: [
//         Column(
//           children: [
//             Visibility(
//               visible: isFirst ?? true,
//               child: Visibility(
//                 visible: (firstLineType ?? LineType.solid) == LineType.solid,
//                 replacement: DottedLine(
//                   dashColor: color ?? Colors.blue,
//                   dashLength: dashLength ?? 4,
//                   lineThickness: firstLineThickness ?? 2.0,
//                   lineLength: lineLength ?? 30, // Match height
//                   direction: Axis.vertical,
//                 ),
//                 child: Container(
//                   width: firstLineThickness ?? 2.0,
//                   height: (lineLength ?? 30) - 1,
//                   color: Colors.blue,
//                 ),
//               ),
//             ),
//             Container(
//               alignment: Alignment.center,
//               width: connectorSize ?? 20.0,
//               height: connectorSize ?? 20.0,
//               decoration: BoxDecoration(
//                 border: Border.all(
//                   color: color ?? Colors.blue,
//                   width: connectorThickness ?? 1.5,
//                 ),
//                 borderRadius: BorderRadius.circular(50.0),
//               ),
//               child: FittedBox(
//                 fit: BoxFit.scaleDown,
//                 child: Text(
//                   "${value ?? ' '}",
//                   style: Theme.of(context).textTheme.bodyMedium!.copyWith(
//                         color: color ?? Colors.blue,
//                         fontWeight: FontWeight.w600,
//                       ),
//                 ),
//               ),
//             ),
//             Visibility(
//               visible: isLast ?? true,
//               child: Visibility(
//                 visible: (lastLineType ?? LineType.solid) == LineType.solid,
//                 replacement: DottedLine(
//                   dashColor: color ?? Colors.blue,
//                   dashLength: dashLength ?? 4,
//                   lineThickness: lastLineThickness ?? 2.0,
//                   lineLength: lineLength ?? 30, // Match height
//                   direction: Axis.vertical,
//                 ),
//                 child: Container(
//                   width: lastLineThickness ?? 2.0,
//                   height: (lineLength ?? 30) - 1,
//                   color: Colors.blue,
//                 ),
//               ),
//             )
//           ],
//         ),
//         child
//       ],
//     );
//   }
// }
