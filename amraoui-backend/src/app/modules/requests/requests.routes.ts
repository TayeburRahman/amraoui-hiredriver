import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { RequestsController } from './requests.controller';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════
//  DRIVER ROUTES  (Flutter app — /api/v1/requests/missions/*)
// ═══════════════════════════════════════════════════════════════════

// GET /api/v1/requests/missions
// Returns all missions visible to this driver (open + driver's own quotes)
router.get(
  '/missions',
  auth(ENUM_USER_ROLE.DRIVER),
  RequestsController.getMissionsForDriver
);

// POST /api/v1/requests/missions/:id/quote
// Driver submits or updates their quote on a mission
router.post(
  '/missions/:id/quote',
  auth(ENUM_USER_ROLE.DRIVER),
  RequestsController.submitDriverQuote
);

// PATCH /api/v1/requests/missions/:id/start
// Driver starts an assigned mission
router.patch(
  '/missions/:id/start',
  auth(ENUM_USER_ROLE.DRIVER),
  RequestsController.startMission
);

// PATCH /api/v1/requests/missions/:id/cancel
// Driver cancels an assigned mission
router.patch(
  '/missions/:id/cancel',
  auth(ENUM_USER_ROLE.DRIVER),
  RequestsController.cancelMissionByDriver
);

// ═══════════════════════════════════════════════════════════════════
//  ADMIN ROUTES  (Dashboard — /api/v1/requests/*)
// ═══════════════════════════════════════════════════════════════════

// GET /api/v1/requests
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.getAllRequests
);

// GET /api/v1/requests/:id
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.getRequestById
);

// PATCH /api/v1/requests/:id/status
router.patch(
  '/:id/status',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.updateRequestStatus
);

// PATCH /api/v1/requests/:id/cancel  (Admin cancel)
router.patch(
  '/:id/cancel',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.cancelRequest
);

export const RequestsRoutes = router;
