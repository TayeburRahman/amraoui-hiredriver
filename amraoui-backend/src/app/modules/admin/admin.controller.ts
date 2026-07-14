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

// ─── Approve customer ────────────────────────────────
const approveCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.approveCustomer(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer approved successfully',
    data: result,
  });
});

// ─── Create Customer manually ────────────────────────
const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createCustomer(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Customer created successfully',
    data: result,
  });
});

// ─── Add Customer Login ────────────────────────
const addCustomerLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.addCustomerLogin(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Customer sub-login added successfully',
    data: result,
  });
});

// ─── Update Customer Login ─────────────────────
const updateCustomerLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateCustomerLogin(req.params.id, req.params.authId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer sub-login updated successfully',
    data: result,
  });
});

// ─── Delete Customer Login ─────────────────────
const deleteCustomerLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteCustomerLogin(req.params.id, req.params.authId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer sub-login deleted successfully',
    data: result,
  });
});

// ─── Update Customer Profile ───────────────────
const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateCustomer(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer updated successfully',
    data: result,
  });
});

// ─── Delete Customer ───────────────────────────
const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteCustomer(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer deleted successfully',
    data: result,
  });
});

export const AdminController = {
  blockUnblockAuthUser,
  getAllCustomers,
  getCustomerById,
  getAllAdmins,
  getDashboardStats,
  approveCustomer,
  createCustomer,
  addCustomerLogin,
  updateCustomerLogin,
  deleteCustomerLogin,
  updateCustomer,
  deleteCustomer,
};