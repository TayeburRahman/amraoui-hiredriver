import { Request, Response } from 'express';
import { RequestsService } from './requests.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchasync';

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (userId) {
    req.body.customerId = userId;
  }
  const result = await RequestsService.createRequest(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Request created successfully',
    data: result,
  });
});

const getAllRequests = catchAsync(async (req: Request, res: Response) => {
  // Use generic query for now
  const result = await RequestsService.getAllRequests(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requests retrieved successfully',
    data: result,
  });
});

const getRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestsService.getRequestById(req.params.id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request retrieved successfully',
    data: result,
  });
});

const sendAdminQuote = catchAsync(async (req: Request, res: Response) => {
  const { amount, message } = req.body;
  const result = await RequestsService.sendAdminQuote(req.params.id, amount, message);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin quote sent successfully',
    data: result,
  });
});

const customerReplyQuote = catchAsync(async (req: Request, res: Response) => {
  const { action } = req.body; // 'ACCEPT' or 'REJECT'
  const result = await RequestsService.customerReplyQuote(req.params.id, action);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Quote ${action.toLowerCase()}ed successfully`,
    data: result,
  });
});

const publishMission = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestsService.publishMission(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mission published for drivers',
    data: result,
  });
});

const getMissionsForDrivers = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const result = await RequestsService.getMissionsForDrivers(driverId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Missions retrieved successfully',
    data: result,
  });
});

const submitDriverQuote = catchAsync(async (req: Request, res: Response) => {
  const { amount, message, estimatedTime } = req.body;
  const driverId = (req as any).user.userId;
  
  const result = await RequestsService.submitDriverQuote(req.params.id, {
    driverId,
    amount,
    message,
    estimatedTime,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver quote submitted successfully',
    data: result,
  });
});

const assignDriver = catchAsync(async (req: Request, res: Response) => {
  const { quoteId, driverId } = req.body;
  const result = await RequestsService.assignDriver(req.params.id, quoteId || driverId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver assigned successfully',
    data: result,
  });
});

const addExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestsService.addExpense(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense added successfully',
    data: result,
  });
});

const removeExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestsService.removeExpense(req.params.id, req.params.expenseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense removed successfully',
    data: result,
  });
});

const updateBaseFee = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const result = await RequestsService.updateBaseFee(req.params.id, Number(amount));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Base fee updated successfully',
    data: result,
  });
});

const startMission = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user.userId;
  const result = await RequestsService.startMission(req.params.id, driverId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mission started successfully',
    data: result,
  });
});

export const RequestsController = {
  createRequest,
  getAllRequests,
  getRequestById,
  sendAdminQuote,
  customerReplyQuote,
  publishMission,
  getMissionsForDrivers,
  submitDriverQuote,
  assignDriver,
  startMission,
  addExpense,
  removeExpense,
  updateBaseFee,
};
