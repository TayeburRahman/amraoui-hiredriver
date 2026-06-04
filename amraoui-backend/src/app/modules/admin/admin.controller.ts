import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { AdminService } from './admin.service';
import sendResponse from '../../../shared/sendResponse';

// ─── Block / Unblock a user ──────────────────────────
const blockUnblockAuthUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.blockUnblockAuthUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User status updated successfully!',
    data: result,
  });
});

// ─── Get all customers ───────────────────────────────
const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllCustomers(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customers retrieved successfully',
    data: result,
  });
});

// ─── Get single customer ─────────────────────────────
const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getCustomerById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer retrieved successfully',
    data: result,
  });
});

// ─── Get all admins ──────────────────────────────────
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admins retrieved successfully',
    data: result,
  });
});

// ─── Dashboard stats ─────────────────────────────────
const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  blockUnblockAuthUser,
  getAllCustomers,
  getCustomerById,
  getAllAdmins,
  getDashboardStats,
};