class AppRoutes {
  static final AppRoutes _instant = AppRoutes._appRoutes();
  AppRoutes._appRoutes();

  factory AppRoutes() {
    return _instant;
  }
  // Auth
  static const initial = "/";
  static const errorScreen = "/error";
  static const signIn = "/signIn";
  static const signUp = "/signUp";
  static const forgotPassword = "/forgotPassword";
  static const verifyCode = "/verifyCode";
  static const createNewPassword = "/createNewPassword";
  static const activateAccount = "/activateAccount";
  static const submitDocuments = "/submitDocuments";
  static const pendingApproval = "/pendingApproval";
  static const navigationScreen = "/navigationScreen";

  // Account sub-pages
  static const profile = "/profile";
  static const documents = "/documents";
  static const language = "/language";
  static const accountChangePassword = "/accountChangePassword";
  static const helpSupport = "/helpSupport";
  static const invoices = "/invoices";
  static const skillsOverview = "/skillsOverview";
  static const detail = "/detail";
}
