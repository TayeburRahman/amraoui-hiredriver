import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { DriverService } from './drivers.service';
import { IReqUser } from '../auth/auth.interface';
import ApiError from '../../../errors/ApiError';

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

const deleteMyDocument = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const { documentType } = req.body;

  if (!documentType) {
    throw new ApiError(400, 'Document type is required');
  }

  const result = await DriverService.deleteMyDocument(user.userId, documentType);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Document deleted successfully',
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

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const file = req.file;
  const result = await DriverService.updateProfileImage(user.userId, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile image updated successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const result = await DriverService.updateMyProfile(user.userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver profile updated successfully',
    data: result,
  });
});

const updateMySkills = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const { skills } = req.body;
  const result = await DriverService.updateMySkills(user.userId, skills);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Skills updated successfully',
    data: result,
  });
});

const createDriverByAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.createDriverByAdmin(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Driver created successfully',
    data: result,
  });
});

const updateDocumentByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = (req as any).files as Record<string, Express.Multer.File[]>;
  const adminName = (req.user as any)?.name || 'Admin';
  
  const result = await DriverService.updateDocumentByAdmin(id, files, adminName);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Document uploaded successfully',
    data: result,
  });
});

const deleteDocumentByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { documentType } = req.body;
  const adminName = (req.user as any)?.name || 'Admin';

  if (!documentType) {
    throw new ApiError(400, 'Document type is required');
  }

  const result = await DriverService.deleteDocumentByAdmin(id, documentType, adminName);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Document deleted successfully',
    data: result,
  });
});

const updateDocumentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { documentType, status, message } = req.body;
  const adminName = (req.user as any)?.name || 'Admin';

  const result = await DriverService.updateDocumentStatus(id, documentType, status, message, adminName);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Document status updated to ${status}`,
    data: result,
  });
});

const updateAdminNotes = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  
  const result = await DriverService.updateAdminNotes(id, notes);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin notes updated successfully',
    data: result,
  });
});

const updateDriverByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DriverService.updateDriverByAdmin(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver updated successfully',
    data: result,
  });
});

const deleteDriverByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await DriverService.deleteDriverByAdmin(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver deleted successfully',
    data: null,
  });
});

export const DriverController = {
  getAllDrivers,
  getDriverById,
  getMyProfile,
  submitMyDocuments,
  updateDriverStatus,
  updateMyLocation,
  uploadProfileImage,
  updateMyProfile,
  updateMySkills,
  deleteMyDocument,
  createDriverByAdmin,
  updateDocumentByAdmin,
  deleteDocumentByAdmin,
  updateDocumentStatus,
  updateAdminNotes,
  updateDriverByAdmin,
  deleteDriverByAdmin,
};
