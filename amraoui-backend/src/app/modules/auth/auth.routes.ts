import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { AdminController } from '../admin/admin.controller';

const router = express.Router();

// ─── Public Auth Routes ────────────────────────────────
router.post(
  '/register',
  uploadFile(),
  (req, res, next) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (e) {
        // ignore
      }
    }
    if (req.files) {
      const files = req.files as any;
      if (files.vehicle_carrier_image && files.vehicle_carrier_image[0]) {
        req.body.vehicle_carrier_image = files.vehicle_carrier_image[0].path;
      }
      if (files.dealer_plate_image && files.dealer_plate_image[0]) {
        req.body.dealer_plate_image = files.dealer_plate_image[0].path;
      }
    }
    next();
  },
  validateRequest(AuthValidation.create),
  AuthController.registrationAccount
);
router.post('/login', validateRequest(AuthValidation.loginZodSchema), AuthController.loginAccount);
router.post('/activate-user', AuthController.activateAccount);
router.post('/active-resend', AuthController.resendCodeActivationAccount);
router.post('/forgot-password', AuthController.forgotPass);
router.post('/resend-forgot', AuthController.resendCodeForgotAccount);
router.post('/verify-otp', AuthController.checkIsValidForgetActivationCode);
router.post('/reset-password', AuthController.resetPassword);

// ─── Authenticated Routes (all roles) ─────────────────
router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AuthController.changePassword
);

router.get(
  '/profile',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AuthController.getMyProfile
);

router.delete(
  '/delete-account',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.ADMIN),
  AuthController.deleteMyAccount
);

router.patch(
  '/edit-profile',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  validateRequest(AuthValidation.updateUserZodSchema),
  AuthController.updateMyProfile
);

// ─── Admin: Block / Unblock any user ──────────────────
router.patch(
  '/block-unblock',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AuthValidation.blockUnblockUserZodSchema),
  AdminController.blockUnblockAuthUser
);

export const AuthRoutes = router;
