import express from 'express';
import { NotificationController } from './notifications.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.getMyNotifications
);

router.patch(
  '/mark-all-read',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.markAllAsRead
);

router.patch(
  '/:id/read',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.markAsRead
);

export const NotificationRoutes = router;
