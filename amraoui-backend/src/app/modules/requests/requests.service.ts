import { FilterQuery, Types } from 'mongoose';
import Requests from './requests.model';
import { IRequest, RequestStatus } from './requests.interface';

// ─── Get All Requests (Admin) ───────────────────────────────────────────────
const getAllRequests = async (filters: {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { status, type, search, page = 1, limit = 50 } = filters;
  const skip = (page - 1) * limit;

  const query: FilterQuery<IRequest> = {};

  if (status) query.status = status;
  if (type) query.type = type;

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

// ─── Get Single Request ─────────────────────────────────────────────────────
const getRequestById = async (id: string) => {
  return Requests.findById(id)
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
      myQuoteMessage: myQuote?.message ?? null,
      myQuoteTime: myQuote?.estimatedTime ?? null,
      myQuoteId: myQuote?._id ?? null,
    };
  });

  return result;
};

// ─── Submit / Update Driver Quote ───────────────────────────────────────────
const submitDriverQuote = async (
  missionId: string,
  driverId: string,
  amount: number,
  message: string,
  estimatedTime?: string
) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  const driverObjId = new Types.ObjectId(driverId);
  const existingIdx = mission.driverQuotes.findIndex(
    (q) => q.driverId?.toString() === driverId
  );

  if (existingIdx >= 0) {
    // Update existing quote
    mission.driverQuotes[existingIdx].amount = amount;
    mission.driverQuotes[existingIdx].message = message;
    if (estimatedTime) mission.driverQuotes[existingIdx].estimatedTime = estimatedTime;
    mission.driverQuotes[existingIdx].status = 'PENDING';
  } else {
    // Add new quote
    mission.driverQuotes.push({
      driverId: driverObjId as any,
      amount,
      message,
      estimatedTime,
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
  
  updatedDetails.pickupInspection[section] = {
    ...updatedDetails.pickupInspection[section],
    ...data,
    updatedAt: new Date()
  };

  mission.set('details', updatedDetails);
  mission.markModified('details');
  
  await mission.save();
  return mission;
};

export const RequestsService = {
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
  getMissionsForDriver,
  submitDriverQuote,
  startMission,
  cancelMissionByDriver,
  assignDriver,
  verifyPickup,
  updatePickupInspection,
};
