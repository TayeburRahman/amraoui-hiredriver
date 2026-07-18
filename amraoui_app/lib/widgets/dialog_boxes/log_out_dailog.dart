import 'package:Vehiqqo/const/storage/get_storage.dart';
import 'package:Vehiqqo/const/utils/app_colors.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:Vehiqqo/widgets/log_print/error_log.dart';
import 'package:get/get.dart';
import 'package:Vehiqqo/utils/app_size.dart';
import 'package:Vehiqqo/utils/gap.dart';
import 'package:Vehiqqo/widgets/texts/app_text.dart';

void logOutDialog() {
  Get.dialog(
    Dialog(
      backgroundColor: AppColors.white,
      child: Padding(
        padding: EdgeInsets.all(AppSize.width(value: 20)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Gap(height: 10),
            const AppText(
              data: "LogOut",
              fontWeight: FontWeight.bold,
              fontSize: 20,
              color: AppColors.primary,
            ),
            const Gap(height: 30),
            const AppText(
              data:
                  "Are you sure you want to log out? You'll need to login again to use the app.",
              textAlign: TextAlign.center,
              height: 1.5,
            ),
            const Gap(height: 30),
            Row(
              children: [

                Expanded(
                  child: Container(
                    margin: EdgeInsets.all(AppSize.width(value: 5)),
                    height: AppSize.height(value: 50),
                    decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xffEE4747)),
                      color: const Color(0xffEE4747).withOpacity(.1),
                      borderRadius: BorderRadius.circular(AppSize.width(value: 8.0)),
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(AppSize.width(value: 8.0)),
                        onTap: () {
                          _logoutFun();
                        },
                        child: Container(
                          alignment: Alignment.center,
                          child: const AppText(
                            data: "LogOut",
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Color(0xffEE4747),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const Gap(height: 20),
          ],
        ),
      ),
    ),
  );
}

Future<void> _logoutFun() async {
  try {
    Get.back();
    Get.offAllNamed(AppRoutes.signIn);
    await AppStorage().removeValue(StorageKey.loginValue);
    await AppStorage().removeValue(StorageKey.userInfo);
    await AppStorage().storageAllClear();
  } catch (e) {
    errorLog("_logoutFun", e);
  }
}
