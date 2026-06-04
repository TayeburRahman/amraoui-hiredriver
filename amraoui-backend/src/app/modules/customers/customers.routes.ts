import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { CustomerController } from './customers.controller';

const router = express.Router();

// ─── Customer: own profile ────────────────────────────
router.get(
  '/profile',
  auth(ENUM_USER_ROLE.CUSTOMERS),
  CustomerController.getProfile
);

// ─── Customer: order history ──────────────────────────
router.get(
  '/order-history',
  auth(ENUM_USER_ROLE.CUSTOMERS),
  CustomerController.getOrderHistory
);

export const CustomerRoutes = router;
