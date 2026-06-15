import express from 'express';
import { RequestsController } from './requests.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

// Customer creates request
router.post('/', auth('CUSTOMERS', 'ADMIN', 'SUPER_ADMIN'), RequestsController.createRequest);

// Customer / Admin view all or specific requests
router.get('/', RequestsController.getAllRequests);
router.get('/missions', auth(ENUM_USER_ROLE.DRIVER), RequestsController.getMissionsForDrivers); // Specific route for drivers
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
router.post('/:id/driver-quote', auth(ENUM_USER_ROLE.DRIVER), RequestsController.submitDriverQuote);

export const RequestsRoutes = router;
