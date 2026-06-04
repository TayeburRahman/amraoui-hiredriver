import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { CustomerService } from './customers.service';
import { IReqUser } from '../auth/auth.interface';

// ─── Get own profile ─────────────────────────────────
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const result = await CustomerService.getProfile(user.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

// ─── Get order history ────────────────────────────────
const getOrderHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const result = await CustomerService.getOrderHistory(user.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order history retrieved successfully',
    data: result,
  });
});

export const CustomerController = {
  getProfile,
  getOrderHistory,
};
