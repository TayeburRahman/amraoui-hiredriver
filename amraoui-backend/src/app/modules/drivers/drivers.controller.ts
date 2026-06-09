import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { DriverService } from './drivers.service';
import { IReqUser } from '../auth/auth.interface';

const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getAllDrivers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Drivers retrieved successfully',
    data: result,
  });
});

const getDriverById = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getDriverById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver retrieved successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const result = await DriverService.getMyDriverProfile(user.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver profile retrieved successfully',
    data: result,
  });
});

const submitMyDocuments = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const files = (req as any).files as Record<string, Express.Multer.File[]>;
  const result = await DriverService.submitDriverDocuments(user.userId, files);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Documents submitted successfully. Please wait for admin verification.',
    data: result,
  });
});

const updateDriverStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  const result = await DriverService.updateDriverStatus(id, status, reason);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Driver ${status} successfully`,
    data: result,
  });
});

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
  getMyProfile,
  submitMyDocuments,
  updateDriverStatus,
  updateMyLocation,
};
