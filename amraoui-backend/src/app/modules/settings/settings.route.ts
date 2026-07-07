import express from 'express';
import { SettingsController } from './settings.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  SettingsController.getSettings
);

router.put(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SettingsController.updateSettings
);

export const SettingsRoutes = router;
