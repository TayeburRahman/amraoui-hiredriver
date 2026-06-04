import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { validateRequest } from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AuthValidation } from '../auth/auth.validation';

const router = express.Router();

// ─── Dashboard ────────────────────────────────────────
router.get(
  '/dashboard/stats',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getDashboardStats
);

// ─── Customer Management ─────────────────────────────
// GET /admin/customers?page=1&limit=10&search=john&status=active
router.get(
  '/customers',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getAllCustomers
);

router.get(
  '/customers/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getCustomerById
);

// ─── Admin Management (SUPER_ADMIN only) ────────────
router.get(
  '/admins',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getAllAdmins
);

export const AdminRoutes = router;
