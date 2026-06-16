import Requests from './requests.model';
import { IRequest, RequestStatus, RequestType } from './requests.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const generateMissionId = () => {
  return `MS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
};

const createRequest = async (payload: Partial<IRequest>): Promise<IRequest> => {
  if (!payload.missionId) {
    payload.missionId = generateMissionId();
  }
  const request = await Requests.create(payload);
  return request;
};

const getAllRequests = async (query: any): Promise<IRequest[]> => {
  const requests = await Requests.find(query)
    .sort({ createdAt: -1 })
    .populate('customerId')
    .populate('assignedDriverId')
    .populate('driverQuotes.driverId');
  return requests;
};

const getRequestById = async (id: string, query: any = {}): Promise<IRequest | null> => {
  const request = await Requests.findById(id).populate('customerId').populate('assignedDriverId').populate('driverQuotes.driverId');
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  // Calculate sameTypeDeliveries for each driver quote
  const requestDoc = request.toObject() as any;
  if (requestDoc.driverQuotes && requestDoc.driverQuotes.length > 0) {
    for (let i = 0; i < requestDoc.driverQuotes.length; i++) {
      const driverId = requestDoc.driverQuotes[i].driverId?._id || requestDoc.driverQuotes[i].driverId;
      if (driverId) {
        const count = await Requests.countDocuments({
          $or: [{ assignedDriverId: driverId }, { assignedDriverIds: driverId }],
          type: request.type,
          status: RequestStatus.COMPLETED
        });
        requestDoc.driverQuotes[i].driverId.sameTypeDeliveries = count;

        const activeCount = await Requests.countDocuments({
          $or: [{ assignedDriverId: driverId }, { assignedDriverIds: driverId }],
          status: { $in: [RequestStatus.ASSIGNED, RequestStatus.IN_PROGRESS] }
        });
        requestDoc.driverQuotes[i].driverId.activeMissionsCount = activeCount;
      }
    }
    // Apply API filtering and sorting based on query params
    const { filter, sort } = query;
    let baseQuotes = requestDoc.driverQuotes;

    if (filter === "Available Now") {
      baseQuotes = baseQuotes.filter((quote: any) => {
          const activeMissionsCount = quote.driverId?.activeMissionsCount || 0;
          return quote.status === 'PENDING' && activeMissionsCount === 0;
      });
    }

    if (filter === "Best Match") {
      baseQuotes = baseQuotes.map((quote: any) => {
        let score = 0;
        
        const sameTypeDeliveries = quote.driverId?.sameTypeDeliveries || 0;
        score += sameTypeDeliveries * 50;

        const rating = parseFloat(quote.driverId?.rating || "0");
        score += rating * 20;

        const proposedPrice = Number(requestDoc.adminQuote?.amount) || Number(requestDoc.details?.servicePrice) || 0;
        const totalExpenses = requestDoc.expenses?.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0) || 0;
        const totalBilledToCustomer = proposedPrice + totalExpenses;

        if (totalBilledToCustomer > 0) {
            const quoteRatio = Number(quote.amount) / totalBilledToCustomer;
            if (quoteRatio < 0.05) {
                score -= 100;
            } else if (quoteRatio <= 1.0) {
                const distanceToOptimal = Math.abs(0.8 - quoteRatio);
                score += Math.max(0, 100 - (distanceToOptimal * 200)); 
            } else {
                score -= 50;
            }
        }
        
        return { ...quote, matchScore: score };
      });

      const maxScore = baseQuotes.length > 0 ? Math.max(...baseQuotes.map((q: any) => q.matchScore)) : 0;
      baseQuotes = baseQuotes.filter((quote: any) => quote.matchScore === maxScore);
    }

    // Sort the quotes
    if (sort === "Highest Rating") {
      baseQuotes = baseQuotes.sort((a: any, b: any) => {
        const ratingA = parseFloat(a.driverId?.rating || "0");
        const ratingB = parseFloat(b.driverId?.rating || "0");
        return ratingB - ratingA;
      });
    } else {
      // Default sort is Lowest Quote
      baseQuotes = baseQuotes.sort((a: any, b: any) => a.amount - b.amount);
    }

    requestDoc.driverQuotes = baseQuotes;
  }

  return requestDoc;
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

const getMissionsForDrivers = async (driverId?: string): Promise<any[]> => {
  // Drivers can only see missions that are open for drivers or where they have submitted a quote
  const query: any = {
    $or: [
      { status: { $in: [RequestStatus.OPEN_FOR_DRIVERS, RequestStatus.ADMIN_REVIEWING_DRIVERS] } }
    ]
  };

  if (driverId) {
    query.$or.push({ 'driverQuotes.driverId': driverId });
    // Also include ASSIGNED and IN_PROGRESS missions where this driver is assigned
    query.$or.push({ assignedDriverId: driverId, status: { $in: [RequestStatus.ASSIGNED, RequestStatus.IN_PROGRESS, RequestStatus.COMPLETED] } });
  }

  const missions = await Requests.find(query)
    .sort({ createdAt: -1 })
    .populate('customerId', 'name email phone_number address profile_image');

  return missions.map(mission => {
    const doc = mission.toObject() as any;
    const myQuote = doc.driverQuotes?.find((q: any) => q.driverId?.toString() === driverId?.toString());
    return {
      ...doc,
      myQuoteStatus: myQuote ? myQuote.status : null,
      myQuoteAmount: myQuote ? myQuote.amount : null,
      myQuoteMessage: myQuote ? myQuote.message : null,
      myQuoteTime: myQuote ? myQuote.estimatedTime : null,
    };
  });
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

  const existingQuoteIndex = request.driverQuotes.findIndex((q: any) => q.driverId?.toString() === quoteData.driverId?.toString());

  if (existingQuoteIndex !== -1) {
    // Update existing quote
    request.driverQuotes[existingQuoteIndex].amount = quoteData.amount;
    request.driverQuotes[existingQuoteIndex].message = quoteData.message;
    request.driverQuotes[existingQuoteIndex].estimatedTime = quoteData.estimatedTime;
    request.driverQuotes[existingQuoteIndex].createdAt = new Date();
  } else {
    // Add the quote
    request.driverQuotes.push({
      ...quoteData,
      status: 'PENDING',
      createdAt: new Date(),
    });
  }

  await request.save();
  return request;
};

const assignDriver = async (id: string, quoteId: string): Promise<IRequest | null> => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  // Handle legacy records missing missionId
  if (!request.missionId) {
    request.missionId = generateMissionId();
  }

  // Find the specific quote and mark it accepted
  const quoteIndex = request.driverQuotes.findIndex((q: any) => 
    (quoteId && q._id?.toString() === quoteId.toString()) || 
    (q.driverId && q.driverId.toString() === quoteId.toString())
  );
  if (quoteIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quote not found');
  }
  
  const driverIdStr = request.driverQuotes[quoteIndex].driverId.toString();
  request.driverQuotes[quoteIndex].status = 'ACCEPTED';

  // Initialize assignedDriverIds array if it doesn't exist
  if (!request.assignedDriverIds) {
    request.assignedDriverIds = [];
    if (request.assignedDriverId) {
      request.assignedDriverIds.push(request.assignedDriverId as any);
    }
  }

  // Add the new driver if not already added
  if (!request.assignedDriverIds.includes(driverIdStr as any)) {
    request.assignedDriverIds.push(driverIdStr as any);
  }

  // Maintain the legacy field (set it to the first assigned driver)
  if (!request.assignedDriverId) {
    request.assignedDriverId = driverIdStr as any;
  }

  // Determine required drivers count
  let requiredDrivers = 1;
  if (request.type === RequestType.HIRE_DRIVER) {
    requiredDrivers = request.details?.driverCount ? parseInt(request.details.driverCount.toString()) : 1;
  }

  // Check if mission is fully staffed
  const acceptedQuotesCount = request.driverQuotes.filter((q: any) => q.status === 'ACCEPTED').length;
  if (acceptedQuotesCount >= requiredDrivers) {
    request.status = RequestStatus.ASSIGNED;
    // Mark all other PENDING quotes as REJECTED
    request.driverQuotes.forEach((quote) => {
      if (quote.status === 'PENDING') {
        quote.status = 'REJECTED';
      }
    });
  }

  await request.save();
  return request;
};

const startMission = async (id: string, driverId: string): Promise<IRequest | null> => {
  const request = await Requests.findById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mission not found');
  }

  if (request.status !== RequestStatus.ASSIGNED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mission is not in ASSIGNED status');
  }

  // Verify this driver is actually assigned
  const isAssigned =
    request.assignedDriverId?.toString() === driverId ||
    (request.assignedDriverIds || []).some((d: any) => d.toString() === driverId);

  if (!isAssigned) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not assigned to this mission');
  }

  request.status = RequestStatus.IN_PROGRESS;
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
  startMission,
  addExpense,
  removeExpense,
  updateBaseFee,
};
