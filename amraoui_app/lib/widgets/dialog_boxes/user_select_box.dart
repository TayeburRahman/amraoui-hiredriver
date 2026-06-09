// import 'package:flutter/material.dart';
// import 'package:get/get.dart';


// userSelectDialog() {
//   Get.dialog(
//     Dialog(
//       insetPadding: const EdgeInsets.symmetric(horizontal: 10),
//       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
//       backgroundColor: AppColors.white200,
//       child: Padding(
//         padding: const EdgeInsets.symmetric(horizontal: 15),
//         child: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             Row(
//               mainAxisAlignment: MainAxisAlignment.end,
//               children: [
//                 IconButton(
//                     onPressed: () {
//                       Get.closeAllDialogs();
//                     },
//                     icon: const Icon(Icons.close))
//               ],
//             ),
//             const AppText(
//               data: AppString.hi,
//               fontWeight: FontWeight.bold,
//               fontSize: 20,
//               color: AppColors.buttonColorBlue,
//             ),
//             const Gap(height: 30),
//             const AppText(
//               data: AppString.pleaseSelectYowYouWantToUseThisApp,
//               textAlign: TextAlign.center,
//               height: 1.5,
//             ),
//             const Gap(height: 30),
//             SizedBox(
//               child: Row(
//                 mainAxisSize: MainAxisSize.max,
//                 children: [
//                   Expanded(
//                     child: GestureDetector(
//                       onTap: () {
//                         // Get.closeAllDialogs();
//                         Get.toNamed(AppRoutes.signUp);
//                         selectedUser = UserType.professional;
//                         Get.closeAllDialogs();
//                       },
//                       child: Container(
//                         margin: EdgeInsets.all(AppSize.width(value: 5)),
//                         padding: EdgeInsets.all(AppSize.width(value: 5)),
//                         width: Get.width,
//                         height: AppSize.height(value: 50),
//                         alignment: Alignment.center,
//                         decoration: BoxDecoration(
//                             border: Border.all(color: AppColors.dark500),
//                             color: AppColors.white50,
//                             borderRadius: BorderRadius.circular(
//                                 AppSize.width(value: 8.0))),
//                         child: const AppText(
//                           data: AppString.professional,
//                           fontSize: 18,
//                           fontWeight: FontWeight.w700,
//                           color: AppColors.dark500,
//                         ),
//                       ),
//                     ),
//                   ),
//                   Expanded(
//                     child: GestureDetector(
//                       onTap: () {
//                         Get.toNamed(AppRoutes.signUp);
//                         selectedUser = UserType.user;
//                         Get.closeAllDialogs();
//                         // Get.offAllNamed(AppRoutes.signIn);
//                       },
//                       child: Container(
//                         margin: EdgeInsets.all(AppSize.width(value: 5)),
//                         padding: EdgeInsets.all(AppSize.width(value: 5)),
//                         width: Get.width,
//                         height: AppSize.height(value: 50),
//                         alignment: Alignment.center,
//                         decoration: BoxDecoration(
//                             border: Border.all(color: AppColors.dark500),
//                             color: AppColors.dark500,
//                             borderRadius: BorderRadius.circular(
//                               AppSize.width(value: 8.0),
//                             )),
//                         child: const AppText(
//                           data: AppString.user,
//                           fontSize: 18,
//                           fontWeight: FontWeight.w700,
//                           color: AppColors.white50,
//                         ),
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//             const Gap(height: 30),
//           ],
//         ),
//       ),
//     ),
//   );
// }
