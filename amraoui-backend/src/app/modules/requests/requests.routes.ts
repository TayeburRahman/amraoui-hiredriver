import express from 'express';
import { RequestsController } from './requests.controller';

const router = express.Router();

// Customer creates request
router.post('/', RequestsController.createRequest);

// Customer / Admin view all or specific requests
router.get('/', RequestsController.getAllRequests);
router.get('/missions', RequestsController.getMissionsForDrivers); // Specific route for drivers
router.get('/:id', RequestsController.getRequestById);

// Admin actions
router.patch('/:id/admin-quote', RequestsController.sendAdminQuote);
router.patch('/:id/publish-mission', RequestsController.publishMission);
router.patch('/:id/assign-driver', RequestsController.assignDriver);
router.post('/:id/expenses', RequestsController.addExpense);
router.delete('/:id/expenses/:expenseId', RequestsController.removeExpense);
router.patch('/:id/base-fee', RequestsController.updateBaseFee);

// Customer actions
router.patch('/:id/customer-reply', RequestsController.customerReplyQuote);

// Driver actions
router.post('/:id/driver-quote', RequestsController.submitDriverQuote);

export const RequestsRoutes = router;
