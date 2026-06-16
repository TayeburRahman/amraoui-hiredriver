import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { RequestsService } from './requests.service';
import { RequestStatus } from './requests.interface';

// ─── GET /api/v1/requests ───────────────────────────────────────────────────
const getAllRequests = catchAsync(async (req: Request, res: Response) => {
  const { status, type, search, page, limit } = req.query as Record<string, string>;

  const result = await RequestsService.getAllRequests({
    status,
    type,
    search,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requests fetched successfully',
    data: result.data,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
    },
  });
});

// ─── GET /api/v1/requests/:id ───────────────────────────────────────────────
const getRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const request = await RequestsService.getRequestById(id);

  if (!request) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Request not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request fetched successfully',
    data: request,
  });
});

// ─── PATCH /api/v1/requests/:id/status ─────────────────────────────────────
const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: RequestStatus };

  const updated = await RequestsService.updateRequestStatus(id, status);

  if (!updated) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Request not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request status updated successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/:id/cancel (Admin) ─────────────────────────────
const cancelRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await RequestsService.cancelRequest(id);

  if (!updated) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Request not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request cancelled successfully',
    data: updated,
  });
});

const getMissionsForDriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  console.log('[BACKEND] Fetching missions for driverId:', driverId);

  const data = await RequestsService.getMissionsForDriver(driverId);
  console.log('[BACKEND] Total missions fetched:', data.length);
  if (data.length > 0) {
    console.log('[BACKEND] Sample mission quote status:', data[0]._id, 'status:', data[0].status, 'myQuoteStatus:', data[0].myQuoteStatus);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Missions fetched successfully',
    data,
  });
});

// ─── POST /api/v1/requests/missions/:id/quote (Driver) ──────────────────────
const submitDriverQuote = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const { id } = req.params;
  const { amount, message, estimatedTime } = req.body;

  const updated = await RequestsService.submitDriverQuote(
    id, driverId, Number(amount), message, estimatedTime
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote submitted successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/missions/:id/start (Driver) ─────────────────────
const startMission = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const { id } = req.params;

  const updated = await RequestsService.startMission(id, driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mission started successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/missions/:id/cancel (Driver) ────────────────────
const cancelMissionByDriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const { id } = req.params;
  const { reason = '', note = '' } = req.body;

  const updated = await RequestsService.cancelMissionByDriver(id, driverId, reason, note);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mission cancelled successfully',
    data: updated,
  });
});

export const RequestsController = {
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
  getMissionsForDriver,
  submitDriverQuote,
  startMission,
  cancelMissionByDriver,
};
