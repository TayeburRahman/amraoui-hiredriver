import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
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

// POST /api/v1/requests (Create a new request, can be anonymous)
router.post(
  '/',
  RequestsController.createRequest
);

// GET /api/v1/requests
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.getAllRequests
);

// GET /api/v1/requests/:id
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.getRequestById
);

// PUT /api/v1/requests/:id (Customer edit)
router.put(
  '/:id',
  auth(ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.updateCustomerRequest
);

// PATCH /api/v1/requests/:id/status
router.patch(
  '/:id/status',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.updateRequestStatus
);

// PATCH /api/v1/requests/:id/base-fee
router.patch(
  '/:id/base-fee',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.updateBaseFee
);

// PATCH /api/v1/requests/:id/driver-price
router.patch(
  '/:id/driver-price',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.updateDriverPrice
);

// PATCH /api/v1/requests/:id/admin-quote
router.patch(
  '/:id/admin-quote',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.sendAdminQuote
);

// PATCH /api/v1/requests/:id/customer-reply
router.patch(
  '/:id/customer-reply',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.customerReply
);

// PATCH /api/v1/requests/:id/cancel  (Admin cancel)
router.patch(
  '/:id/cancel',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.cancelRequest
);

// PUT /api/v1/requests/:id (Customer edit)
router.put(
  '/:id',
  auth(ENUM_USER_ROLE.CUSTOMERS, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.updateCustomerRequest
);

// PATCH /api/v1/requests/:id/cancel-customer (Customer cancel)
router.patch(
  '/:id/cancel-customer',
  auth(ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.cancelCustomerRequest
);

// POST /api/v1/requests/:id/expenses
router.post(
  '/:id/expenses',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  uploadFile(),
  RequestsController.addExpense
);

// DELETE /api/v1/requests/:id/expenses/:expenseId
router.delete(
  '/:id/expenses/:expenseId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.deleteExpense
);

// DELETE /api/v1/requests/:id  (Admin delete)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CUSTOMERS),
  RequestsController.deleteRequest
);

// PATCH /api/v1/requests/:id/assign-driver (Admin assign)
router.patch(
  '/:id/assign-driver',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.assignDriver
);

// PATCH /api/v1/requests/missions/:id/pickup-verification
router.patch(
  '/missions/:id/pickup-verification',
  auth(ENUM_USER_ROLE.DRIVER),
  RequestsController.verifyPickup
);

// PATCH /api/v1/requests/missions/:id/delivery-arrival
router.patch(
  '/missions/:id/delivery-arrival',
  auth(ENUM_USER_ROLE.DRIVER),
  RequestsController.verifyDeliveryArrival
);

// PATCH /api/v1/requests/missions/:id/pickup-inspection
router.patch(
  '/missions/:id/pickup-inspection',
  auth(ENUM_USER_ROLE.DRIVER),
  uploadFile(),
  RequestsController.updatePickupInspection
);

// PATCH /api/v1/requests/missions/:id/delivery-inspection
router.patch(
  '/missions/:id/delivery-inspection',
  auth(ENUM_USER_ROLE.DRIVER),
  uploadFile(),
  RequestsController.updateDeliveryInspection
);

// PATCH /api/v1/requests/:id/invoice (Admin upload invoice)
router.patch(
  '/:id/invoice',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  RequestsController.uploadInvoice
);

// PATCH /api/v1/requests/:id/documents (Admin upload document)
router.patch(
  '/:id/documents',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  RequestsController.addDocument
);

// DELETE /api/v1/requests/:id/documents (Admin delete document)
router.delete(
  '/:id/documents',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RequestsController.deleteDocument
);

export const RequestsRoutes = router;
