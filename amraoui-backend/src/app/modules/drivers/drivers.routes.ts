import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { validateRequest } from '../../middlewares/validateRequest';
import { DriverController } from './drivers.controller';
import { DriverValidation } from './drivers.validation';

const router = express.Router();

// ─── Admin Routes ────────────────────────────────────
// List all drivers (filter by status: pending | approved | declined)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.getAllDrivers
);

// Get a single driver by ID
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.getDriverById
);

// Approve or decline a driver registration
router.patch(
  '/:id/status',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(DriverValidation.updateDriverStatusSchema),
  DriverController.updateDriverStatus
);

// ─── Driver Routes ───────────────────────────────────
// Driver updates their own live location
router.patch(
  '/my/location',
  auth(ENUM_USER_ROLE.DRIVER),
  validateRequest(DriverValidation.updateLocationSchema),
  DriverController.updateMyLocation
);

export const DriverRoutes = router;
