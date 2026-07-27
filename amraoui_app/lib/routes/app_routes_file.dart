import 'package:get/get.dart';
import 'package:Vehiqqo/routes/Internet_check_middle_ware.dart';
import 'package:Vehiqqo/routes/app_routes.dart';
import 'package:Vehiqqo/screens/error_screen/error_screen.dart';
import 'package:Vehiqqo/screens/splash_screen/splash_screen.dart';
import 'package:Vehiqqo/screens/auth/sign_in_screen.dart';
import 'package:Vehiqqo/screens/auth/sign_up_screen.dart';
import 'package:Vehiqqo/screens/auth/forgot_password_screen.dart';
import 'package:Vehiqqo/screens/auth/verify_code_screen.dart';
import 'package:Vehiqqo/screens/auth/create_new_password_screen.dart';
import 'package:Vehiqqo/screens/auth/activate_account_screen.dart';
import 'package:Vehiqqo/screens/auth/submit_documents_screen.dart';
import 'package:Vehiqqo/screens/auth/pending_approval_screen.dart';
import 'package:Vehiqqo/screens/navigation/navigation_screen.dart';
import 'package:Vehiqqo/screens/account/profile_screen.dart';
import 'package:Vehiqqo/screens/account/documents_screen.dart';
import 'package:Vehiqqo/screens/account/language_screen.dart';
import 'package:Vehiqqo/screens/account/account_change_password_screen.dart';
import 'package:Vehiqqo/screens/account/help_support_screen.dart';
import 'package:Vehiqqo/screens/account/invoices_screen.dart';
import 'package:Vehiqqo/screens/account/skills_overview_screen.dart';
import 'package:Vehiqqo/screens/common/detail_screen.dart';

List<GetPage> appRoutesFile = <GetPage>[
  GetPage(
    name: AppRoutes.initial,
    page: () => const SplashScreen(),
    // binding: AppInitialBinding(),
    middlewares: [InternetCheckMiddleWare()],
  ),
  GetPage(name: AppRoutes.errorScreen, page: () => const ErrorScreen()),
  GetPage(name: AppRoutes.signIn, page: () => const SignInScreen()),
  GetPage(name: AppRoutes.signUp, page: () => const SignUpScreen()),
  GetPage(
    name: AppRoutes.forgotPassword,
    page: () => const ForgotPasswordScreen(),
  ),
  GetPage(name: AppRoutes.verifyCode, page: () => const VerifyCodeScreen()),
  GetPage(
    name: AppRoutes.createNewPassword,
    page: () => const CreateNewPasswordScreen(),
  ),
  GetPage(
    name: AppRoutes.activateAccount,
    page: () => const ActivateAccountScreen(),
  ),
  GetPage(
    name: AppRoutes.submitDocuments,
    page: () => const SubmitDocumentsScreen(),
  ),
  GetPage(
    name: AppRoutes.pendingApproval,
    page: () => const PendingApprovalScreen(),
  ),
  GetPage(
    name: AppRoutes.navigationScreen,
    page: () => const NavigationScreen(),
  ),
  GetPage(name: AppRoutes.profile, page: () => const ProfileScreen()),
  GetPage(name: AppRoutes.documents, page: () => const DocumentsScreen()),
  GetPage(name: AppRoutes.language, page: () => const LanguageScreen()),
  GetPage(
    name: AppRoutes.accountChangePassword,
    page: () => const AccountChangePasswordScreen(),
  ),
  GetPage(name: AppRoutes.helpSupport, page: () => const HelpSupportScreen()),
  GetPage(name: AppRoutes.invoices, page: () => const InvoicesScreen()),
  GetPage(
    name: AppRoutes.skillsOverview,
    page: () => const SkillsOverviewScreen(),
  ),
  GetPage(name: AppRoutes.detail, page: () => const DetailScreen()),
];
