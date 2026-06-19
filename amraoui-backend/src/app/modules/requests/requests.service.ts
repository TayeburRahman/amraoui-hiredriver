import { FilterQuery, Types } from 'mongoose';
import Requests from './requests.model';
import { IRequest, RequestStatus } from './requests.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

// ─── Get All Requests (Admin) ───────────────────────────────────────────────
const getAllRequests = async (filters: {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  customerId?: string;
}) => {
  const { status, type, search, page = 1, limit = 50, customerId } = filters;
  const skip = (page - 1) * limit;

  const query: FilterQuery<IRequest> = {};

  if (status) query.status = status;
  if (type) query.type = type;
  if (customerId) query.customerId = customerId;

  const populate = [
    { path: 'customerId', select: 'name email phone profileImage' },
    { path: 'assignedDriverId', select: 'name email phone' },
    { path: 'assignedDriverIds', select: 'name email phone' },
    { path: 'driverQuotes.driverId', select: 'name email phone_number profile_image license_number vehicle_type vehicle_plate status' },
  ];

  const [data, total] = await Promise.all([
    Requests.find(query)
      .populate(populate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Requests.countDocuments(query),
  ]);

  return { data, total, page, limit };
};

// ─── Create Request ───────────────────────────────────────────────────────────
const createRequest = async (payload: any) => {
  const count = await Requests.countDocuments();
  payload.missionId = `MS-${(count + 1).toString().padStart(5, '0')}`;

  if (!payload.status) {
    payload.status = RequestStatus.PENDING_ADMIN_QUOTE;
  }

  const result = await Requests.create(payload);
  return result;
};

// ─── Get Single Request ─────────────────────────────────────────────────────
const getRequestById = async (id: string) => {
  const isObjectId = Types.ObjectId.isValid(id);
  const query = isObjectId ? { _id: id } : { missionId: id };
  
  return Requests.findOne(query)
    .populate({ path: 'customerId', select: 'name email phone profileImage' })
    .populate({ path: 'assignedDriverId', select: 'name email phone' })
    .populate({ path: 'assignedDriverIds', select: 'name email phone' })
    .populate({
      path: 'driverQuotes.driverId',
      select: 'name email phone_number profile_image license_number vehicle_type vehicle_plate status rating jobsCompleted distance isVerified documents_submitted license_document id_document contract_document',
    })
    .lean();
};

// ─── Update Request Status ──────────────────────────────────────────────────
const updateRequestStatus = async (id: string, status: RequestStatus) => {
  return Requests.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).lean();
};

// ─── Cancel Request (Admin) ─────────────────────────────────────────────────
const cancelRequest = async (id: string) => {
  return Requests.findByIdAndUpdate(
    id,
    { status: RequestStatus.CANCELLED },
    { new: true }
  ).lean();
};

// ─── Delete Request (Admin) ─────────────────────────────────────────────────
const deleteRequest = async (id: string) => {
  return Requests.findByIdAndDelete(id).lean();
};

// ─── Get Missions For Driver ────────────────────────────────────────────────
// Returns all open missions + missions this driver has quoted/been assigned to
const getMissionsForDriver = async (driverId: string) => {
  const driverObjId = new Types.ObjectId(driverId);

  // Fetch missions that are open for bidding OR the driver is involved in
  const missions = await Requests.find({
    $or: [
      // Open for drivers to bid
      { status: { $in: [RequestStatus.OPEN_FOR_DRIVERS, RequestStatus.ADMIN_REVIEWING_DRIVERS] } },
      // Driver already has a quote on it
      { 'driverQuotes.driverId': driverObjId },
      // Driver is assigned
      { assignedDriverId: driverObjId },
      { assignedDriverIds: driverObjId },
    ],
  })
    .populate({ path: 'customerId', select: 'name email phone profileImage' })
    .sort({ createdAt: -1 })
    .lean();

  // Inject `myQuoteStatus` field so the Flutter app knows this driver's quote state
  const result = missions.map((m: any) => {
    const myQuote = m.driverQuotes?.find(
      (q: any) => q.driverId?.toString() === driverId
    );
    return {
      ...m,
      myQuoteStatus: myQuote?.status ?? null,   // 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
      myQuoteAmount: myQuote?.amount ?? null,
      myQuoteFuelCost: myQuote?.fuelCost ?? null,
      myQuoteTollCharges: myQuote?.tollCharges ?? null,
      myQuoteTravelCost: myQuote?.travelCost ?? null,
      myQuoteTaxiCost: myQuote?.taxiCost ?? null,
      myQuoteExceptionalCosts: myQuote?.exceptionalCosts ?? null,
      myQuoteMessage: myQuote?.message ?? null,
      myQuoteTime: myQuote?.estimatedTime ?? null,
      myQuoteId: myQuote?._id ?? null,
    };
  });

  return result;
};

// ─── Update Base Fee (Admin) ────────────────────────────────────────────────
const updateBaseFee = async (id: string, amount: number) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { 'adminQuote.amount': amount },
    { new: true }
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  return result;
};

// ─── Send Admin Quote ───────────────────────────────────────────────────────
const sendAdminQuote = async (id: string, quoteData: any) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { 
      'adminQuote.amount': quoteData.amount,
      'adminQuote.message': quoteData.message,
      status: 'CUSTOMER_REVIEWING_QUOTE'
    },
    { new: true }
  );
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  return result;
};

// ─── Customer Reply ─────────────────────────────────────────────────────────
const customerReply = async (id: string, action: 'ACCEPT' | 'REJECT') => {
  const status = action === 'ACCEPT' ? 'OPEN_FOR_DRIVERS' : 'REJECTED_BY_CUSTOMER';
  const result = await Requests.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  return result;
};

// ─── Add / Delete Expense ────────────────────────────────────────────────
const addExpense = async (id: string, expenseData: any) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { $push: { expenses: expenseData } },
    { new: true }
  );
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  return result;
};

const deleteExpense = async (id: string, expenseId: string) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { $pull: { expenses: { _id: expenseId } } },
    { new: true }
  );
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  return result;
};

// ─── Submit / Update Driver Quote ───────────────────────────────────────────
const submitDriverQuote = async (
  missionId: string,
  driverId: string,
  quoteData: {
    amount: number;
    fuelCost?: number;
    tollCharges?: number;
    travelCost?: number;
    taxiCost?: number;
    exceptionalCosts?: number;
    message: string;
    estimatedTime?: string;
  }
) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  const driverObjId = new Types.ObjectId(driverId);
  const existingIdx = mission.driverQuotes.findIndex(
    (q) => q.driverId?.toString() === driverId
  );

  if (existingIdx >= 0) {
    // Update existing quote
    mission.driverQuotes[existingIdx].amount = quoteData.amount;
    mission.driverQuotes[existingIdx].fuelCost = quoteData.fuelCost || 0;
    mission.driverQuotes[existingIdx].tollCharges = quoteData.tollCharges || 0;
    mission.driverQuotes[existingIdx].travelCost = quoteData.travelCost || 0;
    mission.driverQuotes[existingIdx].taxiCost = quoteData.taxiCost || 0;
    mission.driverQuotes[existingIdx].exceptionalCosts = quoteData.exceptionalCosts || 0;
    mission.driverQuotes[existingIdx].message = quoteData.message;
    if (quoteData.estimatedTime) mission.driverQuotes[existingIdx].estimatedTime = quoteData.estimatedTime;
    mission.driverQuotes[existingIdx].status = 'PENDING';
  } else {
    // Add new quote
    mission.driverQuotes.push({
      driverId: driverObjId as any,
      amount: quoteData.amount,
      fuelCost: quoteData.fuelCost || 0,
      tollCharges: quoteData.tollCharges || 0,
      travelCost: quoteData.travelCost || 0,
      taxiCost: quoteData.taxiCost || 0,
      exceptionalCosts: quoteData.exceptionalCosts || 0,
      message: quoteData.message,
      estimatedTime: quoteData.estimatedTime,
      status: 'PENDING',
      createdAt: new Date(),
    });
  }

  await mission.save();
  return mission;
};

// ─── Start Mission (Driver) ─────────────────────────────────────────────────
const startMission = async (missionId: string, driverId: string) => {
  const mission = await Requests.findOne({
    _id: missionId,
    $or: [
      { assignedDriverId: new Types.ObjectId(driverId) },
      { assignedDriverIds: new Types.ObjectId(driverId) },
    ],
    status: RequestStatus.ASSIGNED,
  });

  if (!mission) throw new Error('Mission not found or not assigned to you');

  mission.status = RequestStatus.IN_PROGRESS;
  await mission.save();
  return mission;
};

// ─── Cancel Mission (Driver) ────────────────────────────────────────────────
const cancelMissionByDriver = async (
  missionId: string,
  driverId: string,
  reason: string,
  note: string
) => {
  const mission = await Requests.findOne({
    _id: missionId,
    $or: [
      { assignedDriverId: new Types.ObjectId(driverId) },
      { assignedDriverIds: new Types.ObjectId(driverId) },
    ],
  });

  if (!mission) throw new Error('Mission not found or not assigned to you');

  mission.status = RequestStatus.CANCELLED;
  await mission.save();
  return mission;
};

// ─── Assign Driver (Admin) ──────────────────────────────────────────────────
const assignDriver = async (missionId: string, quoteId: string) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  const quote = mission.driverQuotes.find((q: any) => q._id?.toString() === quoteId);
  if (!quote) throw new Error('Quote not found');

  // Mark this quote as ACCEPTED, others as REJECTED
  mission.driverQuotes.forEach((q: any) => {
    q.status = q._id?.toString() === quoteId ? 'ACCEPTED' : 'REJECTED';
  });

  mission.assignedDriverId = quote.driverId;
  mission.status = RequestStatus.ASSIGNED;

  await mission.save();
  return Requests.findById(missionId).populate([
    { path: 'customerId', select: 'name email phone profileImage' },
    { path: 'assignedDriverId', select: 'name email phone' },
  ]).lean();
};

const verifyPickup = async (missionId: string, driverId: string, lat: number, lng: number) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  if (mission.assignedDriverId?.toString() !== driverId) {
    throw new Error('Not authorized to update this mission');
  }

  const updatedDetails = {
    ...mission.details,
    pickupVerification: {
      verifiedAt: new Date(),
      location: { lat, lng },
      vehicleMatchConfirmed: true,
      arrivalDeclared: true
    }
  };

  mission.set('details', updatedDetails);
  mission.markModified('details');

  await mission.save();
  return mission;
};

const verifyDeliveryArrival = async (missionId: string, driverId: string, lat: number, lng: number) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  if (mission.assignedDriverId?.toString() !== driverId) {
    throw new Error('Not authorized to update this mission');
  }

  const updatedDetails = {
    ...mission.details,
    deliveryArrivalDeclared: true,
    deliveryArrivalTime: new Date().toISOString(),
    deliveryArrivalLocation: {
      type: 'Point',
      coordinates: [lng, lat]
    }
  };

  mission.set('details', updatedDetails);
  mission.markModified('details');

  await mission.save();
  return mission;
};

const updatePickupInspection = async (missionId: string, driverId: string, section: string, data: any) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  if (mission.assignedDriverId?.toString() !== driverId) {
    throw new Error('Not authorized to update this mission');
  }

  const updatedDetails = { ...mission.details };
  if (!updatedDetails.pickupInspection) {
    updatedDetails.pickupInspection = {};
  }

  if (section === 'uploadDocuments') {
    const existing = data.existingDocuments || [];
    const newDocs = data.documents || [];

    // Ensure both are arrays
    const existingArray = Array.isArray(existing) ? existing : [existing];
    const newDocsArray = Array.isArray(newDocs) ? newDocs : [newDocs];

    updatedDetails.pickupInspection[section] = [...existingArray, ...newDocsArray];
  } else {
    updatedDetails.pickupInspection[section] = {
      ...updatedDetails.pickupInspection[section],
      ...data,
      updatedAt: new Date()
    };
  }

  mission.set('details', updatedDetails);
  mission.markModified('details');

  await mission.save();
  return mission;
};

const updateDeliveryInspection = async (missionId: string, driverId: string, section: string, data: any) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  if (mission.assignedDriverId?.toString() !== driverId) {
    throw new Error('Not authorized to update this mission');
  }

  const updatedDetails = { ...mission.details };
  if (!updatedDetails.deliveryInspection) {
    updatedDetails.deliveryInspection = {};
  }

  if (section === 'uploadDocuments') {
    const existing = data.existingDocuments || [];
    const newDocs = data.documents || [];

    // Ensure both are arrays
    const existingArray = Array.isArray(existing) ? existing : [existing];
    const newDocsArray = Array.isArray(newDocs) ? newDocs : [newDocs];

    updatedDetails.deliveryInspection[section] = [...existingArray, ...newDocsArray];
  } else {
    updatedDetails.deliveryInspection[section] = {
      ...updatedDetails.deliveryInspection[section],
      ...data,
      updatedAt: new Date()
    };
  }

  mission.set('details', updatedDetails);
  mission.markModified('details');

  if (section === 'driverConfirmation') {
    mission.status = RequestStatus.COMPLETED;
  }

  await mission.save();
  return mission;
};

export const RequestsService = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
  deleteRequest,
  getMissionsForDriver,
  updateBaseFee,
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
};
