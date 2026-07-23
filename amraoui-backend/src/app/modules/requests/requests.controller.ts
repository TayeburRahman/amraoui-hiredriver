import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { RequestsService } from './requests.service';
import { RequestStatus } from './requests.interface';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';

// ─── POST /api/v1/requests ────────────────────────────────────────────────────
const createRequest = catchAsync(async (req: Request, res: Response) => {
  const tokenWithBearer = req.headers.authorization;
  let customerId;

  if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
    try {
      const token = tokenWithBearer.split(' ')[1];
      const verifyUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      if (verifyUser && verifyUser.role === 'CUSTOMERS') {
        customerId = verifyUser.userId;
      }
    } catch (err) {
      // Ignore token errors for optional auth
    }
  }

  const payload = req.body;
  if (customerId) {
    payload.customerId = customerId;
  }

  const result = await RequestsService.createRequest(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Request created successfully',
    data: result,
  });
});

// ─── GET /api/v1/requests ───────────────────────────────────────────────────
const getAllRequests = catchAsync(async (req: Request, res: Response) => {
  const { status, type, search, page, limit } = req.query as Record<string, string>;
  const user = (req as any).user;

  let customerId;
  if (user && user.role === 'CUSTOMERS') {
    customerId = user.userId;
  }

  const result = await RequestsService.getAllRequests({
    status,
    type,
    search,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    customerId,
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
  const user = (req as any).user;

  if (!request) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Request not found',
      data: null,
    });
  }

  const customerIdString = (request.customerId as any)?._id?.toString() || request.customerId?.toString();

  if (user && user.role === 'CUSTOMERS' && customerIdString !== user.userId) {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: 'Access Forbidden: You do not have permission to view this request',
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

const updateCommissionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { commissionStatus } = req.body as { commissionStatus: string };

  const updated = await RequestsService.updateCommissionStatus(id, commissionStatus);

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
    message: 'Commission status updated successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/:id/base-fee ────────────────────────────────────
const updateBaseFee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount } = req.body;

  const updated = await RequestsService.updateBaseFee(id, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Base fee updated successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/:id/driver-price ────────────────────────────────
const updateDriverPrice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { driverPrice } = req.body;

  const updated = await RequestsService.updateDriverPrice(id, driverPrice);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver price updated successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/:id/admin-quote ─────────────────────────────────
const sendAdminQuote = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quoteData = req.body;

  const updated = await RequestsService.sendAdminQuote(id, quoteData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote sent successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/:id/customer-reply ──────────────────────────────
const customerReply = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body;

  const updated = await RequestsService.customerReply(id, action);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Quote ${action.toLowerCase()}ed successfully`,
    data: updated,
  });
});

// ─── POST /api/v1/requests/:id/expenses ─────────────────────────────────────
const addExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const expenseData = { ...req.body };

  // If proof file uploaded via backend Multer
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['image']) {
      expenseData.proofUrl = files['image'][0].path;
    }
  }

  const updated = await RequestsService.addExpense(id, expenseData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Expense added successfully',
    data: updated,
  });
});

// ─── DELETE /api/v1/requests/:id/expenses/:expenseId ────────────────────────
const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  const { id, expenseId } = req.params;
  const updated = await RequestsService.deleteExpense(id, expenseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense deleted successfully',
    data: updated,
  });
});

// ─── Cancel Request (Admin) ─────────────────────────────────────────────
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

// ─── Delete Request (Admin) ─────────────────────────────────────────────
const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await RequestsService.deleteRequest(id);

  if (!deleted) {
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
    message: 'Request deleted successfully',
    data: deleted,
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
  const { amount, servicePrice, fuelCost, tollCharges, travelCost, taxiCost, message, pickupDate, pickupTime, dropoffDate, dropoffTime } = req.body;

  const quoteData = {
    amount: Number(amount),
    servicePrice: servicePrice ? Number(servicePrice) : 0,
    fuelCost: fuelCost ? Number(fuelCost) : 0,
    tollCharges: tollCharges ? Number(tollCharges) : 0,
    travelCost: travelCost ? Number(travelCost) : 0,
    taxiCost: taxiCost ? Number(taxiCost) : 0,
    message,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime
  };

  const updated = await RequestsService.submitDriverQuote(
    id, driverId, quoteData
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

// ─── PATCH /api/v1/requests/:id/assign-driver (Admin) ──────────────────────
const assignDriver = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quoteId, driverId } = req.body;

  if (!quoteId && !driverId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Either quoteId or driverId is required',
      data: null,
    });
  }

  const updated = await RequestsService.assignDriver(id, quoteId, driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver assigned successfully',
    data: updated,
  });
});

// ─── PATCH /api/v1/requests/missions/:id/pickup-verification (Driver) ─────────
const verifyPickup = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const { id } = req.params;
  const { lat, lng, date, distanceFromTarget } = req.body;

  if (lat === undefined || lng === undefined) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'lat and lng are required',
      data: null,
    });
  }

  const updated = await RequestsService.verifyPickup(id, driverId, lat, lng, date, distanceFromTarget);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pickup verified and location saved successfully',
    data: updated,
  });
});

const verifyDeliveryArrival = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const { id } = req.params;
  const { lat, lng, distanceFromTarget } = req.body;

  if (lat === undefined || lng === undefined) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'lat and lng are required',
      data: null,
    });
  }

  const updated = await RequestsService.verifyDeliveryArrival(id, driverId, lat, lng, distanceFromTarget);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delivery arrival declared and location saved successfully',
    data: updated,
  });
});

const updatePickupInspection = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const { id } = req.params;
  const { section } = req.body;
  console.log('Update Pickup Inspection REQ BODY:', req.body);
  const imageLabels = req.body.imageLabels || req.body['imageLabels[]'];
  console.log('Parsed imageLabels:', imageLabels);

  // If the request has files, map them into the data object
  const data: any = { ...req.body };
  delete data.section; // remove section from data payload
  delete data.imageLabels; // remove labels from payload
  delete data['imageLabels[]'];

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['image']) {
      const images = files['image'];
      let labelsArray: string[] = [];
      if (Array.isArray(imageLabels)) {
        labelsArray = imageLabels;
      } else if (typeof imageLabels === 'string') {
        if (imageLabels.startsWith('[') && imageLabels.endsWith(']')) {
          try {
            labelsArray = JSON.parse(imageLabels);
          } catch (e) {
            // If JSON parse fails, it might be literally "[Front, Front Right]" from Dart toString()
            labelsArray = imageLabels.substring(1, imageLabels.length - 1).split(',').map(s => s.trim());
          }
        } else {
          labelsArray = imageLabels.split(',').map(s => s.trim());
        }
      }

      images.forEach((file, index) => {
        const label = labelsArray[index];
        if (label) {
          if (label === 'document') {
            if (!data.documents) data.documents = [];
            data.documents.push(file.path);
          } else {
            data[label] = file.path;
          }
        }
      });
    }
  }

  if (data.damagesList && typeof data.damagesList === 'string') {
    try {
      const parsedList = JSON.parse(data.damagesList);
      parsedList.forEach((damage: any) => {
        if (damage.photoRef && data[damage.photoRef]) {
          damage.photo = data[damage.photoRef];
          delete data[damage.photoRef];
        }
      });
      data.damagesList = parsedList;
    } catch(e) {
      console.error('Failed to parse damagesList', e);
    }
  }

  const updated = await RequestsService.updatePickupInspection(id, driverId, section, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pickup inspection updated successfully',
    data: updated,
  });
});

const updateDeliveryInspection = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req as any).user?.userId;
  const { id } = req.params;
  const { section } = req.body;
  console.log('Update Delivery Inspection REQ BODY:', req.body);
  const imageLabels = req.body.imageLabels || req.body['imageLabels[]'];
  console.log('Parsed imageLabels for delivery:', imageLabels);

  // If the request has files, map them into the data object
  const data: any = { ...req.body };
  delete data.section; // remove section from data payload
  delete data.imageLabels; // remove labels from payload
  delete data['imageLabels[]'];

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['image']) {
      const images = files['image'];
      let labelsArray: string[] = [];
      if (Array.isArray(imageLabels)) {
        labelsArray = imageLabels;
      } else if (typeof imageLabels === 'string') {
        if (imageLabels.startsWith('[') && imageLabels.endsWith(']')) {
          try {
            labelsArray = JSON.parse(imageLabels);
          } catch (e) {
            // If JSON parse fails, it might be literally "[Front, Front Right]" from Dart toString()
            labelsArray = imageLabels.substring(1, imageLabels.length - 1).split(',').map(s => s.trim());
          }
        } else {
          labelsArray = imageLabels.split(',').map(s => s.trim());
        }
      }

      images.forEach((file, index) => {
        const label = labelsArray[index];
        if (label) {
          if (label === 'document') {
            if (!data.documents) data.documents = [];
            data.documents.push(file.path);
          } else {
            data[label] = file.path;
          }
        }
      });
    }
  }

  if (data.damagesList && typeof data.damagesList === 'string') {
    try {
      const parsedList = JSON.parse(data.damagesList);
      parsedList.forEach((damage: any) => {
        if (damage.photoRef && data[damage.photoRef]) {
          damage.photo = data[damage.photoRef];
          delete data[damage.photoRef];
        }
      });
      data.damagesList = parsedList;
    } catch(e) {
      console.error('Failed to parse damagesList', e);
    }
  }

  const updated = await RequestsService.updateDeliveryInspection(id, driverId, section, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delivery inspection updated successfully',
    data: updated,
  });
});

// ─── Upload Invoice ───────────────────────────────────────────────────────────
const uploadInvoice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files || !files['invoice'] || files['invoice'].length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invoice PDF file is required');
  }

  const fileUrl = files['invoice'][0].path;
  const result = await RequestsService.uploadInvoice(id, fileUrl);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice uploaded successfully',
    data: result,
  });
});

const addDocument = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { documentType, fileUrl: bodyFileUrl, originalName } = req.body;

  // Accept a Cloudinary URL sent directly from the frontend (preferred),
  // OR fall back to a multer-uploaded file for backward compatibility.
  let fileUrl: string | undefined = bodyFileUrl;

  if (!fileUrl) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files && files['document'] && files['document'].length > 0) {
      fileUrl = files['document'][0].path;
    }
  }

  if (!fileUrl) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Document file or URL is required');
  }

  const result = await RequestsService.addDocument(id, fileUrl, documentType, originalName);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Document added successfully',
    data: result,
  });
});

const deleteDocument = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const fileUrl = req.body.fileUrl;

  if (!fileUrl) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Document URL is required');
  }

  const result = await RequestsService.deleteDocument(id, fileUrl);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Document deleted successfully',
    data: result,
  });
});

// ─── Customer Update Request ──────────────────────────────────────────────────
const updateCustomerRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customerId = (req as any).user?.userId;
  const role = (req as any).user?.role;
  const payload = req.body;

  if (!customerId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const updated = await RequestsService.updateCustomerRequest(id, customerId, role, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request updated successfully',
    data: updated,
  });
});

// =================
// ─── Customer Cancel Request ──────────────────────────────────────────────────
const cancelCustomerRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customerId = (req as any).user?.userId;
  const role = (req as any).user?.role;

  if (!customerId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const canceled = await RequestsService.cancelCustomerRequest(id, customerId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request cancelled successfully',
    data: canceled,
  });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  const result = await RequestsService.updatePaymentStatus(id, paymentStatus);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment status updated successfully',
    data: result,
  });
});

export const RequestsController = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  updateCommissionStatus,
  updatePaymentStatus,
  updateBaseFee,
  updateDriverPrice,
  cancelRequest,
  deleteRequest,
  getMissionsForDriver,
  submitDriverQuote,
  startMission,
  cancelMissionByDriver,
  assignDriver,
  verifyPickup,
  verifyDeliveryArrival,
  updatePickupInspection,
  updateDeliveryInspection,
  addExpense,
  deleteExpense,
  sendAdminQuote,
  customerReply,
  uploadInvoice,
  addDocument,
  deleteDocument,
  updateCustomerRequest,
  cancelCustomerRequest,
};
