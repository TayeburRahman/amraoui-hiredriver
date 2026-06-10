import Requests from './requests.model';
import { IRequest, RequestStatus } from './requests.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createRequest = async (payload: Partial<IRequest>): Promise<IRequest> => {
  const request = await Requests.create(payload);
  return request;
};

const getAllRequests = async (query: any): Promise<IRequest[]> => {
  const requests = await Requests.find(query).sort({ createdAt: -1 }).populate('customerId').populate('assignedDriverId');
  return requests;
};

const getRequestById = async (id: string): Promise<IRequest | null> => {
  const request = await Requests.findById(id).populate('customerId').populate('assignedDriverId');
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  return request;
};

const sendAdminQuote = async (id: string, amount: number, message: string): Promise<IRequest | null> => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  
  if (request.status !== RequestStatus.PENDING_ADMIN_QUOTE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request is not in PENDING_ADMIN_QUOTE status');
  }

  request.adminQuote = { amount, message, createdAt: new Date() };
  request.status = RequestStatus.CUSTOMER_REVIEWING_QUOTE;
  await request.save();
  return request;
};

const customerReplyQuote = async (id: string, action: 'ACCEPT' | 'REJECT'): Promise<IRequest | null> => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (request.status !== RequestStatus.CUSTOMER_REVIEWING_QUOTE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request is not pending customer review');
  }

  request.status = action === 'ACCEPT' ? RequestStatus.OPEN_FOR_DRIVERS : RequestStatus.REJECTED_BY_CUSTOMER;
  await request.save();
  return request;
};

const publishMission = async (id: string): Promise<IRequest | null> => {
  // If we want admin to manually publish even after customer accepts
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  request.status = RequestStatus.OPEN_FOR_DRIVERS;
  await request.save();
  return request;
};

const getMissionsForDrivers = async (): Promise<IRequest[]> => {
  // Drivers can only see missions that are open for drivers or where they are assigned (handling assignments later)
  const missions = await Requests.find({
    status: { $in: [RequestStatus.OPEN_FOR_DRIVERS, RequestStatus.ADMIN_REVIEWING_DRIVERS] }
  }).sort({ createdAt: -1 });
  return missions;
};

const submitDriverQuote = async (id: string, quoteData: any): Promise<IRequest | null> => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (request.status !== RequestStatus.OPEN_FOR_DRIVERS && request.status !== RequestStatus.ADMIN_REVIEWING_DRIVERS) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mission is not open for bidding');
  }

  // Update status if it's the first quote
  if (request.status === RequestStatus.OPEN_FOR_DRIVERS) {
    request.status = RequestStatus.ADMIN_REVIEWING_DRIVERS;
  }

  // Add the quote
  request.driverQuotes.push({
    ...quoteData,
    status: 'PENDING',
    createdAt: new Date(),
  });

  await request.save();
  return request;
};

const assignDriver = async (id: string, driverId: string): Promise<IRequest | null> => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  request.assignedDriverId = driverId as any;
  request.status = RequestStatus.ASSIGNED;
  
  // Mark the specific quote as accepted, others as rejected
  request.driverQuotes.forEach((quote) => {
    if (quote.driverId.toString() === driverId.toString()) {
      quote.status = 'ACCEPTED';
    } else {
      quote.status = 'REJECTED';
    }
  });

  await request.save();
  return request;
};

const addExpense = async (id: string, payload: any) => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  request.expenses.push(payload);
  await request.save();

  return request;
};

const removeExpense = async (id: string, expenseId: string) => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  request.expenses = request.expenses.filter((exp: any) => exp._id.toString() !== expenseId);
  await request.save();

  return request;
};

const updateBaseFee = async (id: string, amount: number) => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (!request.adminQuote) {
    request.adminQuote = { amount, message: 'Base fee manually added', createdAt: new Date() };
  } else {
    request.adminQuote.amount = amount;
    if (!request.adminQuote.message) {
       request.adminQuote.message = 'Base fee manually updated';
    }
  }
  
  await request.save();
  return request;
};

export const RequestsService = {
  createRequest,
  getAllRequests,
  getRequestById,
  sendAdminQuote,
  customerReplyQuote,
  publishMission,
  getMissionsForDrivers,
  submitDriverQuote,
  assignDriver,
  addExpense,
  removeExpense,
  updateBaseFee,
};
