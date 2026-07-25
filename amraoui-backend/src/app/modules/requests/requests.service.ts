import { FilterQuery, Types } from 'mongoose';
import Requests from './requests.model';
import { IRequest, RequestStatus } from './requests.interface';

import { customerQuoteEmailBody, customerDriverAssignedEmailBody, customerMissionCompleteEmailBody, driverAssignedEmailBody } from '../../../mails/quote.email';
import { NotificationService } from '../notifications/notifications.service';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import sendEmail from '../../../utils/sendEmail';
import Auth from '../auth/auth.model';
import { ENUM_USER_ROLE } from '../../../enums/user';

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
    { path: 'customerId', select: 'name family_name company company_name email phone phone_number profileImage' },
    { path: 'assignedDriverId', select: 'name family_name email phone phone_number phoneNumber profile_image' },
    { path: 'assignedDriverIds', select: 'name family_name email phone phone_number phoneNumber profile_image' },
    { path: 'driverQuotes.driverId', select: 'name family_name email phone phone_number phoneNumber profile_image license_number vehicle_type vehicle_plate status' },
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
  const lastRequest = await Requests.findOne({}, { missionId: 1 }).sort({ createdAt: -1 });
  let nextIdNumber = 1;

  if (lastRequest && lastRequest.missionId) {
    const lastId = lastRequest.missionId.replace('VQ-', '');
    const parsedId = parseInt(lastId, 10);
    if (!isNaN(parsedId)) {
      nextIdNumber = parsedId + 1;
    }
  }

  // Ensure it's globally unique by querying if it exists (very rare race condition, but good for safety)
  let isUnique = false;
  let proposedId = '';
  while (!isUnique) {
    proposedId = `VQ-${nextIdNumber.toString().padStart(5, '0')}`;
    const exists = await Requests.findOne({ missionId: proposedId }, { _id: 1 });
    if (exists) {
      nextIdNumber++;
    } else {
      isUnique = true;
    }
  }

  payload.missionId = proposedId;

  if (!payload.status) {
    payload.status = RequestStatus.PENDING_ADMIN_QUOTE;
  }

  const result = await Requests.create(payload);

  // Notify Admins
  try {
    const admins = await Auth.find({ role: { $in: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN] } });

    for (const admin of admins) {
      // 1. Create DB Notification
      await NotificationService.createNotification({
        recipientId: admin._id,
        title: 'New Customer Request',
        message: `Customer submitted request ${proposedId}.`,
        type: 'SYSTEM',
        link: '/quote-desk'
      } as any);

      // 2. Send Email
      await sendEmail({
        email: admin.email,
        subject: 'New Transport Request Created',
        html: `A new transport request (${proposedId}) has been created and is waiting for your attention.`
      });

      // 3. Emit Real-Time Socket Event
      if ((global as any).io) {
        // Emit specifically to the admin's room if connected
        (global as any).io.to(String(admin._id)).emit('notification', {
          title: 'New Customer Request',
          message: `Customer submitted request ${proposedId}.`,
          type: 'SYSTEM'
        });
      }
    }
  } catch (error) {
    console.error('Failed to notify admins of new request:', error);
  }

  return result;
};

// ─── Get Single Request ─────────────────────────────────────────────────────
const getRequestById = async (id: string) => {
  const isObjectId = Types.ObjectId.isValid(id);
  const query = isObjectId ? { _id: id } : { missionId: id };

  return Requests.findOne(query)
    .populate({ path: 'customerId', select: 'name family_name company email phone profileImage' })
    .populate({ path: 'assignedDriverId', select: 'name email phone' })
    .populate({ path: 'assignedDriverIds', select: 'name email phone' })
    .populate({
      path: 'driverQuotes.driverId',
      select: 'name email phone_number profile_image license_number vehicle_type vehicle_plate status rating jobsCompleted distance isVerified documents_submitted license_document id_document contract_document',
    })
    .lean();
};

// ─── Update Request Status ─────────────────────────────────────────────
const updateRequestStatus = async (id: string, status: RequestStatus) => {
  const request = await Requests.findById(id);
  if (!request) return null;

  request.status = status;

  if (status === RequestStatus.OPEN_FOR_DRIVERS) {
    request.assignedDriverId = null as any;
    request.assignedDriverIds = [];

    if (request.driverQuotes && request.driverQuotes.length > 0) {
      let quotesUpdated = false;
      request.driverQuotes.forEach((q: any) => {
        if (q.status === 'ACCEPTED') {
          q.status = 'REJECTED';
          quotesUpdated = true;
        }
      });
      if (quotesUpdated) {
        request.markModified('driverQuotes');
      }
    }
  }

  await request.save();
  return Requests.findById(id).lean();
};

const updateCommissionStatus = async (id: string, commissionStatus: string) => {
  return Requests.findByIdAndUpdate(
    id,
    { commissionStatus },
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
      myQuoteServicePrice: myQuote?.servicePrice ?? null,
      myQuoteMessage: myQuote?.message ?? null,
      myQuotePickupDate: myQuote?.pickupDate ?? null,
      myQuotePickupTime: myQuote?.pickupTime ?? null,
      myQuoteDropoffDate: myQuote?.dropoffDate ?? null,
      myQuoteDropoffTime: myQuote?.dropoffTime ?? null,
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

const updateDriverPrice = async (id: string, driverPrice: number) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { 'adminQuote.driverPrice': driverPrice },
    { new: true }
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  return result;
};

// ─── Send Admin Quote ───────────────────────────────────────────────────────
const sendAdminQuote = async (id: string, quoteData: any) => {
  if (quoteData.driverPrice === undefined || quoteData.driverPrice === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Driver Price is required');
  }
  const result = await Requests.findByIdAndUpdate(
    id,
    {
      'adminQuote.amount': quoteData.amount,
      'adminQuote.driverPrice': quoteData.driverPrice,
      'adminQuote.message': quoteData.message,
      status: 'CUSTOMER_REVIEWING_QUOTE'
    },
    { new: true }
  ).populate({ path: 'customerId', select: 'name family_name company email authId' });

  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');

  // Retrieve customer info
  let customerName = 'Customer';
  let customerEmail = '';
  let authId = null;

  if (result.customerId) {
    const customer = result.customerId as any;
    customerName = customer.name || 'Customer';
    customerEmail = customer.email;
    authId = customer.authId || customer._id;
  } else if (result.details) {
    customerName = result.details.firstName ? `${result.details.firstName} ${result.details.lastName || ''}`.trim() : 'Customer';
    customerEmail = result.details.email || result.details.customerEmail;
  }

  const vehicle = result.details?.vehicleType || result.details?.vehicleBrand || result.details?.make
    ? `${result.details.vehicleType || result.details.vehicleBrand || result.details.make || ''} ${result.details.vehicleModel || result.details.model || ''}`.trim()
    : (result.type || 'Vehicle');
  const licensePlate = result.details?.licensePlate || result.details?.vehiclePlate || result.details?.license_plate || result.details?.plate || '';

  // Calculate final total amount including expenses
  const baseAmount = Number(quoteData.amount) || Number(result.adminQuote?.amount) || 0;
  const expensesTotal = result.expenses?.reduce((sum: number, exp: any) => sum + (Number(exp.amount) || 0), 0) || 0;
  const finalTotalAmount = baseAmount + expensesTotal;

  // 1. Send Email
  if (customerEmail) {
    const emailHtml = customerQuoteEmailBody({
      name: customerName,
      requestId: result.missionId || result._id.toString(),
      vehicle,
      licensePlate: licensePlate || undefined,
      baseAmount,
      totalAmount: finalTotalAmount,
      message: quoteData.message,
      expenses: result.expenses || [],
    });


    // Fire and forget
    sendEmail({
      email: customerEmail,
      subject: `Your Quote is Ready - ${result.missionId || 'Request'}`,
      html: emailHtml
    }).catch((err: any) => {
      console.error('Error sending quote email:', err);
    });
  }

  // 2. Create In-App Notification
  if (authId) {
    NotificationService.createNotification({
      recipientId: authId,
      title: 'New Quote Received',
      message: `A quote of €${finalTotalAmount} has been provided for your request (${result.missionId || 'Vehicle'}).`,
      type: 'QUOTE_RECEIVED',
      link: '/dashboard/orders',
      metadata: { requestId: result._id.toString() }
    }).catch((err: any) => {
      console.error('Error creating quote notification:', err);
    });
  }

  return result;
};

// ─── Customer Reply ─────────────────────────────────────────────────────────
const customerReply = async (id: string, action: 'ACCEPT' | 'REJECT') => {
  const status = action === 'ACCEPT' ? 'OPEN_FOR_DRIVERS' : 'REJECTED_BY_CUSTOMER';
  const result = await Requests.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate({ path: 'customerId', select: 'name family_name company email' });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');

  if (action === 'ACCEPT') {
    try {
      const admins = await Auth.find({ role: { $in: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN] } });
      for (const admin of admins) {
        // 1. Create DB Notification
        await NotificationService.createNotification({
          recipientId: admin._id,
          title: 'Quote Accepted',
          message: `Customer accepted the quote for request ${result.missionId || 'Request'}.`,
          type: 'SYSTEM',
          link: '/quote-desk'
        } as any);

        // 2. Send Email
        await sendEmail({
          email: admin.email,
          subject: `Quote Accepted - ${result.missionId || 'Request'}`,
          html: `<p>Great news! The customer has accepted the quote for request <strong>${result.missionId || 'Request'}</strong>. It is now open for drivers to bid.</p>`
        });

        // 3. Emit Real-Time Socket Event
        if ((global as any).io) {
          (global as any).io.to(String(admin._id)).emit('notification', {
            title: 'Quote Accepted',
            message: `Customer accepted the quote for request ${result.missionId || 'Request'}.`,
            type: 'SYSTEM'
          });
        }
      }
    } catch (error) {
      console.error('Failed to notify admins of quote acceptance:', error);
    }
  }

  return result;
};

// ─── Add / Delete Expense ────────────────────────────────────────────────
const addExpense = async (id: string, expenseData: any) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { $push: { expenses: expenseData } },
    { new: true }
  ).populate({ path: 'customerId', select: 'name family_name company email authId' });

  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');

  // Notify customer about the newly added expense
  try {
    const customer: any = result.customerId;
    const custAuthId = customer?.authId || customer?._id;
    if (custAuthId) {
      NotificationService.createNotification({
        recipientId: custAuthId,
        title: 'New Extra Expense Added',
        message: `An extra expense (${expenseData.type || 'Expense'}: €${expenseData.amount}) was added to mission ${result.missionId || 'Request'}.`,
        type: 'SYSTEM',
        link: `/dashboard/orders/${result._id}`,
        metadata: { requestId: result._id.toString() }
      }).catch(console.error);
    }

    if (customer?.email) {
      const baseUrl = process.env.BACKEND_URL || 'https://amraoui-hiredriver-backends.vercel.app';
      const proofLink = expenseData.proofUrl
        ? (expenseData.proofUrl.startsWith('http')
          ? expenseData.proofUrl
          : `${baseUrl}/${expenseData.proofUrl.replace(/\\/g, '/')}`)
        : null;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
            <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo Logo" style="height: 44px; width: auto; display: block; margin: 0 auto;" />
          </div>
          <h2 style="color: #2563eb; margin-bottom: 8px; font-size: 20px;">New Extra Expense Added</h2>
          <p>Hello <strong>${customer.name || 'Customer'}</strong>,</p>
          <p>An extra expense has been added to your mission <strong>${result.missionId || 'Request'}</strong>.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Type:</strong> ${expenseData.type || 'Extra Expense'}</p>
            <p style="margin: 4px 0;"><strong>Amount:</strong> €${expenseData.amount}</p>
            ${expenseData.driverNote ? `<p style="margin: 4px 0;"><strong>Note:</strong> ${expenseData.driverNote}</p>` : ''}
            ${proofLink ? `<p style="margin: 12px 0 4px 0;"><a href="${proofLink}" target="_blank" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 13px;">View Proof Attachment</a></p>` : ''}
          </div>
          <p>Log in to your account to review the updated order details and payment summary.</p>
        </div>
      `;

      sendEmail({
        email: customer.email,
        subject: `Extra Expense Added - Mission ${result.missionId || 'Request'}`,
        html: emailHtml
      }).catch(console.error);
    }
  } catch (err) {
    console.error('Error notifying customer of added expense:', err);
  }

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

const notifyExpensesToCustomer = async (id: string) => {
  const mission = await Requests.findById(id).populate([
    { path: 'customerId', select: 'name family_name company email authId' }
  ]);
  if (!mission) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');

  const customer: any = mission.customerId;
  const customerEmail = customer?.email || (mission as any).details?.customerEmail || (mission as any).details?.email || (mission as any).email;
  const customerName = customer?.name
    ? `${customer.name} ${customer.family_name || ''}`.trim()
    : ((mission as any).details?.firstName ? `${(mission as any).details.firstName} ${(mission as any).details.lastName || ''}`.trim() : null) ||
    (mission as any).details?.customerName ||
    'Customer';

  if (!customer && !customerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer account or email not found for this request');
  }

  const expenses = mission.expenses || [];
  const totalExtra = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

  const custAuthId = customer?.authId || customer?._id;
  if (custAuthId) {
    await NotificationService.createNotification({
      recipientId: custAuthId,
      title: 'Extra Expenses Updated',
      message: `Your mission (${mission.missionId || 'Request'}) extra expenses have been updated. Total extra: €${totalExtra}.`,
      type: 'SYSTEM',
      link: `/dashboard/orders/${mission._id}`,
      metadata: { requestId: mission._id.toString() }
    }).catch(console.error);
  }

  if (customerEmail) {
    const baseUrl = process.env.BACKEND_URL || 'https://amraoui-hiredriver-backends.vercel.app';
    const expensesListHtml = expenses.length > 0
      ? expenses.map((exp: any) => {
        const proofLink = exp.proofUrl
          ? (exp.proofUrl.startsWith('http')
            ? exp.proofUrl
            : `${baseUrl}/${exp.proofUrl.replace(/\\/g, '/')}`)
          : null;
        return `
            <div style="border-bottom: 1px solid #e2e8f0; padding: 8px 0;">
              <p style="margin: 0; font-size: 14px;"><strong>${exp.type || 'Expense'}:</strong> €${exp.amount}</p>
              ${exp.driverNote ? `<p style="margin: 2px 0; font-style: italic; color: #64748b; font-size: 12px;">${exp.driverNote}</p>` : ''}
              ${proofLink ? `<p style="margin: 4px 0;"><a href="${proofLink}" target="_blank" style="color: #2563eb; font-weight: bold; font-size: 12px;">View Proof Attachment</a></p>` : ''}
            </div>
          `;
      }).join('')
      : '<p style="color: #64748b;">No extra expenses listed.</p>';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo Logo" style="height: 44px; width: auto; display: block; margin: 0 auto;" />
        </div>
        <h2 style="color: #2563eb; margin-bottom: 8px; font-size: 20px;">Extra Expenses & Final Invoice Notification</h2>
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>The extra expenses for your mission <strong>${mission.missionId || 'Request'}</strong> have been updated by admin.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Itemized Extra Expenses</h3>
          ${expensesListHtml}
          <p style="margin-top: 16px; font-size: 16px; font-weight: bold; color: #2563eb;">Total Extra Expenses: €${totalExtra}</p>
        </div>
        <p>Log in to your account to review the updated invoice summary.</p>
      </div>
    `;

    await sendEmail({
      email: customerEmail,
      subject: `Extra Expenses Updated - Mission ${mission.missionId || 'Request'}`,
      html: emailHtml
    }).catch(console.error);
  }

  return mission;
};

// ─── Submit / Update Driver Quote ───────────────────────────────────────────
const submitDriverQuote = async (
  missionId: string,
  driverId: string,
  quoteData: {
    amount: number;
    servicePrice?: number;
    fuelCost?: number;
    tollCharges?: number;
    travelCost?: number;
    taxiCost?: number;
    message?: string;
    pickupDate?: string;
    pickupTime?: string;
    dropoffDate?: string;
    dropoffTime?: string;
  }
) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  const driverObjId = new Types.ObjectId(driverId);
  const existingIdx = mission.driverQuotes.findIndex(
    (q) => q.driverId?.toString() === driverId
  );

  let isAutoAssigned = false;
  if (mission.adminQuote?.driverPrice && quoteData.amount <= mission.adminQuote.driverPrice) {
    isAutoAssigned = true;
  }

  if (existingIdx >= 0) {
    // Update existing quote
    mission.driverQuotes[existingIdx].amount = quoteData.amount;
    mission.driverQuotes[existingIdx].servicePrice = quoteData.servicePrice || 0;
    mission.driverQuotes[existingIdx].fuelCost = quoteData.fuelCost || 0;
    mission.driverQuotes[existingIdx].tollCharges = quoteData.tollCharges || 0;
    mission.driverQuotes[existingIdx].travelCost = quoteData.travelCost || 0;
    mission.driverQuotes[existingIdx].taxiCost = quoteData.taxiCost || 0;
    mission.driverQuotes[existingIdx].message = quoteData.message;
    if (quoteData.pickupDate) mission.driverQuotes[existingIdx].pickupDate = quoteData.pickupDate;
    if (quoteData.pickupTime) mission.driverQuotes[existingIdx].pickupTime = quoteData.pickupTime;
    if (quoteData.dropoffDate) mission.driverQuotes[existingIdx].dropoffDate = quoteData.dropoffDate;
    if (quoteData.dropoffTime) mission.driverQuotes[existingIdx].dropoffTime = quoteData.dropoffTime;
    mission.driverQuotes[existingIdx].status = isAutoAssigned ? 'ACCEPTED' : 'PENDING';
  } else {
    // Add new quote
    mission.driverQuotes.push({
      driverId: driverObjId as any,
      amount: quoteData.amount,
      servicePrice: quoteData.servicePrice || 0,
      fuelCost: quoteData.fuelCost || 0,
      tollCharges: quoteData.tollCharges || 0,
      travelCost: quoteData.travelCost || 0,
      taxiCost: quoteData.taxiCost || 0,
      message: quoteData.message,
      pickupDate: quoteData.pickupDate,
      pickupTime: quoteData.pickupTime,
      dropoffDate: quoteData.dropoffDate,
      dropoffTime: quoteData.dropoffTime,
      status: isAutoAssigned ? 'ACCEPTED' : 'PENDING',
      createdAt: new Date(),
    });
  }

  if (isAutoAssigned) {
    // Reject other quotes
    mission.driverQuotes.forEach((q: any) => {
      if (q.driverId?.toString() !== driverId) {
        q.status = 'REJECTED';
      }
    });

    mission.assignedDriverId = driverObjId as any;
    mission.status = RequestStatus.ASSIGNED;
  }

  await mission.save();

  // Helper to format documents for email
  const getMissionAttachments = (details: any) => {
    if (!details?.documents || !Array.isArray(details.documents)) return [];
    return details.documents.map((doc: any) => {
      const docUrl = typeof doc === 'string' ? doc : (doc.url || '');
      if (!docUrl) return null;
      return {
        filename: typeof doc === 'string' ? docUrl.split('/').pop() || 'document' : (doc.originalName || docUrl.split('/').pop() || 'document'),
        path: docUrl.startsWith('http') ? docUrl : `${process.env.BACKEND_URL || 'https://amraoui-hiredriver-backends.vercel.app'}${docUrl.startsWith('/') ? '' : '/'}${docUrl}`
      };
    }).filter(Boolean);
  };

  if (isAutoAssigned) {
    try {
      await mission.populate([
        { path: 'customerId', select: 'name family_name company email authId phone' },
        { path: 'assignedDriverId', select: 'name email phone phone_number authId' }
      ]);

      const customer: any = mission.customerId;
      const driver: any = mission.assignedDriverId;
      const adminAuthId = null; // Admin notification usually doesn't need specific ID if handled globally, but let's notify role ADMIN if possible.

      if (customer) {
        const custAuthId = customer.authId || customer._id;
        // Notify Customer
        NotificationService.createNotification({
          recipientId: custAuthId,
          title: 'Driver Assigned!',
          message: `A driver (${driver?.name || 'Unknown'}) has been assigned to your mission (${mission.missionId || 'Request'}).`,
          type: 'DRIVER_ASSIGNED',
          link: '/dashboard/orders',
          metadata: { requestId: mission._id.toString() }
        }).catch(console.error);

        // Email Customer
        if (customer.email) {
          const emailHtml = customerDriverAssignedEmailBody({
            name: customer.name || 'Customer',
            requestId: mission.missionId || mission._id.toString(),
            driverName: driver?.name || 'Assigned Driver',
            driverPhone: driver?.phone_number || driver?.phone || 'N/A'
          });
          sendEmail({
            email: customer.email,
            subject: `Driver Assigned - ${mission.missionId || 'Request'}`,
            html: emailHtml
          }).catch(console.error);
        }
      }

      if (driver) {
        const driverAuthId = driver.authId || driver._id;
        // Notify Driver
        NotificationService.createNotification({
          recipientId: driverAuthId,
          title: 'Mission Assigned!',
          message: `You have been automatically assigned to mission ${mission.missionId || 'Request'}.`,
          type: 'MISSION_ASSIGNED',
          link: '/driver/missions',
          metadata: { requestId: mission._id.toString() }
        }).catch(console.error);

        // Email Driver
        if (driver.email) {
          const route = mission.type === 'TRANSPORT' ? `${mission.details?.pickupCity || mission.details?.pickupAddress || 'Unknown'} → ${mission.details?.dropoffCity || mission.details?.dropoffAddress || 'Unknown'}` :
            mission.type === 'INSPECTION' ? mission.details?.inspectionLocation || 'Unknown' :
              mission.details?.driverCity || 'Unknown';
          const attachments = getMissionAttachments(mission.details);
          const emailHtml = driverAssignedEmailBody({
            driverName: driver.name || (driver as any).firstName || 'Driver',
            requestId: mission.missionId || mission._id.toString(),
            route,
            hasDocuments: attachments.length > 0
          });
          sendEmail({
            email: driver.email,
            subject: `Mission Assigned - ${mission.missionId || 'Request'}`,
            html: emailHtml,
            attachments
          }).catch(console.error);
        }
      }

      // We could add an admin notification here if there is a specific admin ID.
      // Usually admins might be polling or we can insert a generic notification.
    } catch (e) {
      console.error('Error sending auto-assign notifications:', e);
    }
  }

  return mission;
};

// ─── Start Mission (Driver) ─────────────────────────────────────────────────
const startMission = async (missionId: string, driverId: string) => {
  const mission = await Requests.findOneAndUpdate(
    {
      _id: missionId,
      $or: [
        { assignedDriverId: new Types.ObjectId(driverId) },
        { assignedDriverIds: new Types.ObjectId(driverId) },
      ],
      status: RequestStatus.ASSIGNED,
    },
    {
      $set: {
        status: RequestStatus.IN_PROGRESS,
        'details.startedAt': new Date().toISOString()
      }
    },
    { new: true }
  );

  if (!mission) throw new Error('Mission not found or not assigned to you');
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
const assignDriver = async (missionId: string, quoteId?: string, driverId?: string, amount?: number, extraQuoteDetails?: any) => {
  const mission = await Requests.findById(missionId);
  if (!mission) throw new Error('Mission not found');

  const setPayload: any = { status: RequestStatus.ASSIGNED };

  if (quoteId) {
    const quote = mission.driverQuotes.find((q: any) => q._id?.toString() === quoteId);
    if (!quote) throw new Error('Quote not found');

    const updatedQuotes = mission.driverQuotes.map((q: any) => {
      const qObj = typeof q.toObject === 'function' ? q.toObject() : q;
      return { ...qObj, status: q._id?.toString() === quoteId ? 'ACCEPTED' : 'REJECTED' };
    });

    setPayload.driverQuotes = updatedQuotes;
    setPayload.assignedDriverId = quote.driverId;
  } else if (driverId) {
    const driverObjId = new Types.ObjectId(driverId);
    setPayload.assignedDriverId = driverObjId;

    let updatedQuotes = mission.driverQuotes.map((q: any) => {
      const qObj = typeof q.toObject === 'function' ? q.toObject() : q;
      return { ...qObj, status: 'REJECTED' };
    });

    if (amount !== undefined) {
      updatedQuotes.push({
        driverId: driverObjId,
        amount: Number(amount),
        servicePrice: extraQuoteDetails?.servicePrice ? Number(extraQuoteDetails.servicePrice) : 0,
        fuelCost: extraQuoteDetails?.fuelCost ? Number(extraQuoteDetails.fuelCost) : 0,
        tollCharges: extraQuoteDetails?.tollCharges ? Number(extraQuoteDetails.tollCharges) : 0,
        travelCost: extraQuoteDetails?.travelCost ? Number(extraQuoteDetails.travelCost) : 0,
        taxiCost: extraQuoteDetails?.taxiCost ? Number(extraQuoteDetails.taxiCost) : 0,
        message: extraQuoteDetails?.message || '',
        pickupDate: extraQuoteDetails?.pickupDate || '',
        pickupTime: extraQuoteDetails?.pickupTime || '',
        dropoffDate: extraQuoteDetails?.dropoffDate || '',
        dropoffTime: extraQuoteDetails?.dropoffTime || '',
        status: 'ACCEPTED',
        createdAt: new Date()
      });
    }

    setPayload.driverQuotes = updatedQuotes;
  }

  const updatedMission = await Requests.findByIdAndUpdate(
    missionId,
    { $set: setPayload },
    { new: true }
  );

  if (!updatedMission) throw new Error('Failed to update mission');

  // Re-fetch populated if needed, or just use updatedMission
  const missionPopulated = await Requests.findById(missionId).populate('customerId').populate('assignedDriverId');
  if (!missionPopulated) throw new Error('Failed to fetch populated mission');

  // Replace references of 'mission' below with 'missionPopulated'
  const finalMission = missionPopulated as any;

  // Helper to format documents for email
  const getMissionAttachments = (details: any) => {
    if (!details?.documents || !Array.isArray(details.documents)) return [];

    const getDocLabel = (docUrl: string, index: number) => {
      // Find exact matches if URLs are stored in specific fields
      if (details.vehiclePhotos && docUrl.includes(details.vehiclePhotos)) return 'Vehicle photos';
      if (details.registrationDocumentName && docUrl.includes(details.registrationDocumentName)) return 'Registration document';
      if (details.referenceDocumentName && docUrl.includes(details.referenceDocumentName)) return 'Reference document';

      // Fallback based on sequence (legacy support)
      if (index === 0 && details.vehiclePhotos) return 'Vehicle photos';
      if (index === 1 && details.registrationDocumentName) return 'Registration document';
      if (index === 2 && details.referenceDocumentName) return 'Reference document';

      return `Attached Document ${index + 1}`;
    };

    return details.documents.map((doc: any, i: number) => {
      const docPath = typeof doc === 'string' ? doc : (doc?.url || '');
      if (!docPath) return null; // Skip if no URL is found

      const ext = docPath.split('.').pop() || 'pdf';
      const label = getDocLabel(docPath, i);
      const safeLabel = label.replace(/\s+/g, '_');

      return {
        filename: typeof doc === 'object' && doc.originalName ? doc.originalName : `${safeLabel}.${ext}`,
        path: docPath.startsWith('http') ? docPath : `${process.env.BACKEND_URL || 'https://amraoui-hiredriver-backends.vercel.app'}${docPath.startsWith('/') ? '' : '/'}${docPath}`
      };
    }).filter(Boolean); // Filter out any null entries
  };

  const notifyDriverId = driverId || finalMission.assignedDriverId?._id?.toString() || finalMission.assignedDriverId?.toString();
  if (notifyDriverId) {
    // Notify the assigned driver (either manually or via accepted quote)
    const driver = await (await import('../auth/auth.model')).default.findById(notifyDriverId).lean() || await (await import('../drivers/drivers.model')).default.findById(notifyDriverId).lean();
    if (driver) {
      const authId = driver.authId || driver._id;
      NotificationService.createNotification({
        recipientId: authId,
        title: 'Mission Assigned!',
        message: `You have been assigned to mission ${finalMission.missionId || 'Request'}.`,
        type: 'MISSION_ASSIGNED',
        link: '/driver/missions',
        metadata: { requestId: finalMission._id.toString() }
      }).catch(console.error);

      // Email Driver
      if (driver.email) {
        const route = mission.type === 'TRANSPORT' ? `${mission.details?.pickupCity || mission.details?.pickupAddress || 'Unknown'} → ${mission.details?.dropoffCity || mission.details?.dropoffAddress || 'Unknown'}` :
          mission.type === 'INSPECTION' ? mission.details?.inspectionLocation || 'Unknown' :
            mission.details?.driverCity || 'Unknown';
        const attachments = getMissionAttachments(mission.details);
        const emailHtml = driverAssignedEmailBody({
          driverName: driver.name || (driver as any).firstName || 'Driver',
          requestId: mission.missionId || mission._id.toString(),
          route,
          hasDocuments: attachments.length > 0
        });
        sendEmail({
          email: driver.email,
          subject: `Mission Assigned - ${mission.missionId || 'Request'}`,
          html: emailHtml,
          attachments
        }).catch(console.error);
      }
    }
  }

  return Requests.findById(missionId).populate([
    { path: 'customerId', select: 'name family_name company email phone profileImage' },
    { path: 'assignedDriverId', select: 'name email phone' },
  ]).lean();
};

const verifyPickup = async (missionId: string, driverId: string, lat: number, lng: number, date?: string, distanceFromTarget?: number) => {
  const mission = await Requests.findOne({
    _id: missionId,
    assignedDriverId: new Types.ObjectId(driverId),
  });
  if (!mission) throw new Error('Mission not found or not authorized');

  let updatePayload: Record<string, any>;

  if (date && mission.type === 'HIRE_DRIVER') {
    const driverArrivals = (mission.details?.driverArrivals || []) as any[];
    const existingIdx = driverArrivals.findIndex((a: any) => a.date === date);
    if (existingIdx === -1) {
      driverArrivals.push({
        date,
        verifiedAt: new Date(),
        location: { lat, lng },
      });
    }
    updatePayload = { 'details.driverArrivals': driverArrivals };
  } else {
    updatePayload = {
      'details.pickupVerification': {
        verifiedAt: new Date(),
        location: { lat, lng },
        vehicleMatchConfirmed: true,
        arrivalDeclared: true,
        ...(distanceFromTarget !== undefined && { distanceFromTarget }),
      },
    };
  }

  const updated = await Requests.findByIdAndUpdate(
    missionId,
    { $set: updatePayload },
    { new: true }
  );
  return updated;
};

const verifyDeliveryArrival = async (missionId: string, driverId: string, lat: number, lng: number, distanceFromTarget?: number) => {
  const mission = await Requests.findOne({
    _id: missionId,
    assignedDriverId: new Types.ObjectId(driverId),
  });
  if (!mission) throw new Error('Mission not found or not authorized');

  const setPayload: Record<string, any> = {
    'details.deliveryArrivalDeclared': true,
    'details.deliveryArrivalTime': new Date().toISOString(),
    'details.deliveryArrivalLocation': { type: 'Point', coordinates: [lng, lat] },
  };
  if (distanceFromTarget !== undefined) {
    setPayload['details.deliveryArrivalDistance'] = distanceFromTarget;
  }

  const updated = await Requests.findByIdAndUpdate(
    missionId,
    { $set: setPayload },
    { new: true }
  );
  return updated;
};

const updatePickupInspection = async (missionId: string, driverId: string, section: string, data: any) => {
  const mission = await Requests.findOne({
    _id: missionId,
    assignedDriverId: new Types.ObjectId(driverId),
  });
  if (!mission) throw new Error('Mission not found or not authorized');

  const currentInspection = (mission.details?.pickupInspection as any) || {};
  let sectionValue: any;

  if (section === 'uploadDocuments') {
    const existing = data.existingDocuments || [];
    const newDocs = data.documents || [];
    const existingArray = Array.isArray(existing) ? existing : [existing];
    const newDocsArray = Array.isArray(newDocs) ? newDocs : [newDocs];
    sectionValue = [...existingArray, ...newDocsArray];
  } else {
    sectionValue = { ...(currentInspection[section] || {}), ...data, updatedAt: new Date() };
  }

  const updated = await Requests.findByIdAndUpdate(
    missionId,
    { $set: { [`details.pickupInspection.${section}`]: sectionValue } },
    { new: true }
  );
  return updated;
};

const updateDeliveryInspection = async (missionId: string, driverId: string, section: string, data: any) => {
  const mission = await Requests.findOne({
    _id: missionId,
    assignedDriverId: new Types.ObjectId(driverId),
  });
  if (!mission) throw new Error('Mission not found or not authorized');

  const currentInspection = (mission.details?.deliveryInspection as any) || {};
  let sectionValue: any;

  if (section === 'uploadDocuments') {
    const existing = data.existingDocuments || [];
    const newDocs = data.documents || [];
    const existingArray = Array.isArray(existing) ? existing : [existing];
    const newDocsArray = Array.isArray(newDocs) ? newDocs : [newDocs];
    sectionValue = [...existingArray, ...newDocsArray];
  } else {
    sectionValue = { ...(currentInspection[section] || {}), ...data, updatedAt: new Date() };
  }

  const setPayload: Record<string, any> = {
    [`details.deliveryInspection.${section}`]: sectionValue,
  };

  if (section === 'driverConfirmation') {
    setPayload['status'] = RequestStatus.COMPLETED;
    setPayload['details.completedAt'] = new Date().toISOString();
  }

  const updated = await Requests.findByIdAndUpdate(
    missionId,
    { $set: setPayload },
    { new: true }
  ).populate([
    { path: 'customerId', select: 'name family_name company email authId' },
    { path: 'assignedDriverId', select: 'name email authId' }
  ]);

  if (section === 'driverConfirmation' && updated) {
    try {
      const customer: any = updated.customerId;
      const driver: any = updated.assignedDriverId;

      if (customer) {
        const custAuthId = customer.authId || customer._id;
        NotificationService.createNotification({
          recipientId: custAuthId,
          title: 'Mission Completed',
          message: `Your request (${updated.missionId || 'Vehicle'}) has been completed by the driver.`,
          type: 'MISSION_COMPLETED',
          link: '/dashboard/orders',
          metadata: { requestId: updated._id.toString() }
        }).catch(console.error);

        if (customer.email) {
          const emailHtml = customerMissionCompleteEmailBody({
            name: customer.name || 'Customer',
            requestId: updated.missionId || updated._id.toString()
          });
          sendEmail({
            email: customer.email,
            subject: `Mission Completed - ${updated.missionId || 'Request'}`,
            html: emailHtml
          }).catch(console.error);
        }
      }

      if (driver) {
        const driverAuthId = driver.authId || driver._id;
        NotificationService.createNotification({
          recipientId: driverAuthId,
          title: 'Mission Completed',
          message: `You have successfully completed mission ${updated.missionId || 'Request'}.`,
          type: 'MISSION_COMPLETED',
          link: '/driver/missions',
          metadata: { requestId: updated._id.toString() }
        }).catch(console.error);
      }

      const Admin = (await import('../admin/admin.model')).default;
      const admins = await Admin.find({}).select('authId').lean();
      admins.forEach((admin: any) => {
        if (admin.authId) {
          NotificationService.createNotification({
            recipientId: admin.authId,
            title: 'Mission Completed',
            message: `Mission ${updated.missionId || 'Request'} has been completed by the driver.`,
            type: 'MISSION_COMPLETED',
            link: '/mission-monitoring',
            metadata: { requestId: updated._id.toString() }
          }).catch(console.error);
        }
      });
    } catch (e) {
      console.error('Error sending mission complete notifications:', e);
    }
  }

  return updated;
};

// ─── Upload Invoice ───────────────────────────────────────────────────────────
const uploadInvoice = async (id: string, fileUrl: string) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { invoiceUrl: fileUrl },
    { new: true }
  );
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  return result;
};

// ─── Document Management ───────────────────────────────────────────────────────────
const addDocument = async (id: string, fileUrl: string, documentType?: string, originalName?: string) => {
  const mission = await Requests.findById(id);
  if (!mission) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');

  const docs: any[] = Array.isArray(mission.details?.documents) ? [...mission.details.documents] : [];

  const setPayload: Record<string, any> = {};

  if (documentType) {
    const previousFilename = mission.details?.[documentType];
    if (previousFilename) {
      const idx = docs.findIndex((d: any) => (typeof d === 'string' ? d : d?.url || '').includes(previousFilename));
      if (idx !== -1) docs.splice(idx, 1);
    }
    const newFilename = originalName || fileUrl.split('/').pop() || '';
    setPayload[`details.${documentType}`] = newFilename;
  }

  docs.push({
    url: fileUrl,
    originalName: originalName || (documentType && mission.details?.[documentType]) || fileUrl.split('/').pop() || 'Document',
    documentType: documentType || 'document'
  });
  setPayload['details.documents'] = docs;

  const updated = await Requests.findByIdAndUpdate(id, { $set: setPayload }, { new: true });
  return updated;
};

const deleteDocument = async (id: string, fileUrl: string) => {
  const mission = await Requests.findById(id);
  if (!mission) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');

  if (mission.details?.documents && Array.isArray(mission.details.documents)) {
    const filteredDocs = mission.details.documents.filter((doc: any) => {
      const u = typeof doc === 'string' ? doc : doc?.url || '';
      return u !== fileUrl;
    });
    const updated = await Requests.findByIdAndUpdate(id, { $set: { 'details.documents': filteredDocs } }, { new: true });
    return updated;
  }
  return mission;
};

// ─── Customer Edit Request ────────────────────────────────────────────────────────
const updateCustomerRequest = async (id: string, customerId: string, role: string, payload: any) => {
  const query: any = { _id: id };
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    query.customerId = customerId;
  }
  const mission = await Requests.findOne(query);
  if (!mission) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found or unauthorized');

  // Check if status allows editing (Bypass for Admins)
  const allowedStatuses = [RequestStatus.PENDING_ADMIN_QUOTE, RequestStatus.CUSTOMER_REVIEWING_QUOTE];
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    if (!allowedStatuses.includes(mission.status as RequestStatus)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Cannot edit request at this stage');
    }
  }

  // Update only allowed fields (details mostly)
  const setPayload: Record<string, any> = {};
  if (payload.details) {
    Object.entries(payload.details).forEach(([k, v]) => { setPayload[`details.${k}`] = v; });
  }
  if (payload.type) setPayload['type'] = payload.type;

  const updated = await Requests.findByIdAndUpdate(mission._id, { $set: setPayload }, { new: true });
  return updated;
};

// ─── Customer Cancel Request ──────────────────────────────────────────────────────
const cancelCustomerRequest = async (id: string, customerId: string, role: string) => {
  const query: any = { _id: id };
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    query.customerId = customerId;
  }
  const mission = await Requests.findOne(query);
  if (!mission) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found or unauthorized');

  // Allow cancelling at any time (as per requirements)
  const updated = await Requests.findByIdAndUpdate(mission._id, { $set: { status: RequestStatus.CANCELLED } }, { new: true });
  return updated;
};

const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  const result = await Requests.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  return result;
};

export const RequestsService = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  updateCommissionStatus,
  updatePaymentStatus,
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
  updateDriverPrice,
  addExpense,
  deleteExpense,
  notifyExpensesToCustomer,
  sendAdminQuote,
  customerReply,
  uploadInvoice,
  addDocument,
  deleteDocument,
  updateCustomerRequest,
  cancelCustomerRequest,
};
