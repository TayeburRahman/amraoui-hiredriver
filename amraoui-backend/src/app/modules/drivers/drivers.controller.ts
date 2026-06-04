import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { DriverService } from './drivers.service';
import { IReqUser } from '../auth/auth.interface';

// ─── Admin: Get all drivers ──────────────────────────
const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getAllDrivers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Drivers retrieved successfully',
    data: result,
  });
});

// ─── Admin: Get single driver ────────────────────────
const getDriverById = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getDriverById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver retrieved successfully',
    data: result,
  });
});

// ─── Admin: Approve or Decline a driver ─────────────
const updateDriverStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await DriverService.updateDriverStatus(id, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Driver ${status} successfully`,
    data: result,
  });
});

// ─── Driver: Update own location ─────────────────────
const updateMyLocation = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const { longitude, latitude } = req.body;
  const result = await DriverService.updateDriverLocation(user.userId, [
    Number(longitude),
    Number(latitude),
  ]);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Location updated successfully',
    data: result,
  });
});

export const DriverController = {
  getAllDrivers,
  getDriverById,
  updateDriverStatus,
  updateMyLocation,
};
