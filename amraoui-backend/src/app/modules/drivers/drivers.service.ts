import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import Drivers from './drivers.model';
import Auth from '../auth/auth.model';
import { ENUM_USER_ROLE } from '../../../enums/user';
import sendEmail from '../../../utils/sendEmail';
import { IDrivers } from './drivers.interface';
import config from '../../../config';
import {
  adminNewDriverDocumentsEmailBody,
  driverApprovedEmailBody,
  driverDeclinedEmailBody,
  driverDocumentsSubmittedEmailBody,
} from '../../../mails/driver.emails';
import Requests from '../requests/requests.model';
import { RequestStatus } from '../requests/requests.interface';

const getAllDrivers = async (query: Record<string, any>) => {
  const { status, page = 1, limit = 10, search } = query;

  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone_number: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [drivers, total] = await Promise.all([
    Drivers.find(filter)
      .populate('authId', 'email name isActive is_block')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Drivers.countDocuments(filter),
  ]);

  return {
    drivers,
    meta: { total, page: Number(page), limit: Number(limit) },
  };
};

const getDriverById = async (driverId: string) => {
  const driver = await Drivers.findById(driverId).populate(
    'authId',
    'email name isActive is_block'
  ).lean();
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  const totalDeliveries = await Requests.countDocuments({
    $or: [{ assignedDriverId: driverId }, { assignedDriverIds: driverId }],
    status: RequestStatus.COMPLETED,
  });

  const totalAssigned = await Requests.countDocuments({
    $or: [{ assignedDriverId: driverId }, { assignedDriverIds: driverId }],
  });

  driver.totalDeliveries = totalDeliveries;
  (driver as any).successRate = totalAssigned > 0 ? Math.round((totalDeliveries / totalAssigned) * 100) : 0;

  return driver;
};

const getMyDriverProfile = async (driverId: string) => {
  const driver = await Drivers.findById(driverId).populate(
    'authId',
    'email name isActive is_block role'
  ).lean();
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver profile not found');
  }

  const totalDeliveries = await Requests.countDocuments({
    $or: [{ assignedDriverId: driverId }, { assignedDriverIds: driverId }],
    status: RequestStatus.COMPLETED,
  });

  const totalAssigned = await Requests.countDocuments({
    $or: [{ assignedDriverId: driverId }, { assignedDriverIds: driverId }],
  });

  driver.totalDeliveries = totalDeliveries;
  (driver as any).successRate = totalAssigned > 0 ? Math.round((totalDeliveries / totalAssigned) * 100) : 0;

  return driver;
};

const submitDriverDocuments = async (
  driverId: string,
  files: Record<string, Express.Multer.File[]>
) => {
  const driver = await Drivers.findById(driverId).populate('authId', 'name email');
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  if (driver.status === 'approved') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your account is already approved');
  }

  const licenseFile = files?.license_document?.[0];
  const idFile = files?.id_document?.[0];
  const contractFile = files?.contract_document?.[0];

  if (!licenseFile && !idFile && !contractFile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload at least one document');
  }

  const updateData: Record<string, any> = {
    status: 'pending',
    decline_reason: null,
  };

  if (licenseFile) updateData.license_document = licenseFile.path;
  if (idFile) updateData.id_document = idFile.path;
  if (contractFile) updateData.contract_document = contractFile.path;

  // Mark as submitted only if they have provided both required docs at some point
  if (
    (driver.license_document || licenseFile) &&
    (driver.id_document || idFile)
  ) {
    updateData.documents_submitted = true;
    updateData.documents_submitted_at = driver.documents_submitted_at || new Date();
  }

  const updated = await Drivers.findByIdAndUpdate(driverId, updateData, {
    new: true,
    runValidators: true,
  }).populate('authId', 'email name');

  const driverName = (driver as any).name || 'Driver';
  const driverEmail = (driver as any).email;

  sendEmail({
    email: driverEmail,
    subject: 'Documents Submitted Successfully',
    html: driverDocumentsSubmittedEmailBody({ name: driverName }),
  }).catch((err) => console.error('Driver submit email failed:', err.message));

  const adminEmail = config.smtp?.smtp_mail || process.env.SMTP_MAIL;
  if (adminEmail) {
    sendEmail({
      email: adminEmail,
      subject: 'New Driver Documents Submitted',
      html: adminNewDriverDocumentsEmailBody({
        name: driverName,
        email: driverEmail,
      }),
    }).catch((err) => console.error('Admin notify email failed:', err.message));
  }

  return updated;
};

const deleteMyDocument = async (driverId: string, documentType: string) => {
  const allowedTypes = ['license_document', 'id_document', 'contract_document'];
  if (!allowedTypes.includes(documentType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document type');
  }

  const driver = await Drivers.findById(driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  const updateData: Record<string, any> = {
    [documentType]: null,
    status: 'pending',
  };

  // If deleting a required document, mark documents_submitted as false
  if (documentType === 'license_document' || documentType === 'id_document') {
    updateData.documents_submitted = false;
  }

  const updated = await Drivers.findByIdAndUpdate(driverId, updateData, {
    new: true,
    runValidators: true,
  });

  return updated;
};

const updateDriverStatus = async (
  driverId: string,
  status: 'approved' | 'declined',
  reason?: string
) => {
  const driver = await Drivers.findById(driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  const hasUploadedDocs = driver.license_document || driver.id_document || driver.contract_document;
  
  if (!driver.documents_submitted && !hasUploadedDocs && status === 'approved') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Driver has not submitted any documents yet'
    );
  }

  // Auto-mark as submitted if approving and they have docs
  if (status === 'approved' && !driver.documents_submitted) {
    driver.documents_submitted = true;
  }

  const updatePayload: Record<string, any> = { status };
  if (status === 'declined' && reason) {
    updatePayload.decline_reason = reason;
  }
  if (status === 'approved') {
    updatePayload.decline_reason = null;
  }

  const updated = await Drivers.findByIdAndUpdate(driverId, updatePayload, {
    new: true,
    runValidators: true,
  }).populate('authId', 'email name');

  if (status === 'approved') {
    await Auth.findByIdAndUpdate(driver.authId, { isActive: true, is_block: false });
    sendEmail({
      email: updated!.email,
      subject: 'Your Driver Account Has Been Approved',
      html: driverApprovedEmailBody({ name: updated!.name }),
    }).catch((err) => console.error('Driver approved email failed:', err.message));
  }

  if (status === 'declined') {
    await Auth.findByIdAndUpdate(driver.authId, { isActive: false });
    sendEmail({
      email: updated!.email,
      subject: 'Your Driver Application Was Declined',
      html: driverDeclinedEmailBody({ name: updated!.name, reason }),
    }).catch((err) => console.error('Driver declined email failed:', err.message));
  }

  return updated;
};

const updateDriverLocation = async (
  driverId: string,
  coordinates: [number, number]
) => {
  const driver = await Drivers.findByIdAndUpdate(
    driverId,
    { location: { type: 'Point', coordinates } },
    { new: true }
  );
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  return driver;
};

const updateProfileImage = async (driverId: string, file?: Express.Multer.File) => {
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile image is required');
  }

  const driver = await Drivers.findByIdAndUpdate(
    driverId,
    { profile_image: file.path },
    { new: true, runValidators: true }
  ).populate('authId', 'email name isActive is_block role');

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  return driver;
};

const updateMyProfile = async (driverId: string, payload: Partial<IDrivers>) => {
  const driver = await Drivers.findByIdAndUpdate(driverId, payload, {
    new: true,
    runValidators: true,
  }).populate('authId', 'email name isActive is_block role');

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  // Update Auth collection if name is updated
  if (payload.name) {
    await Auth.findByIdAndUpdate(driver.authId, { name: payload.name });
  }

  return driver;
};

const updateMySkills = async (driverId: string, skills: { name: string; stars: number }[]) => {
  const driver = await Drivers.findByIdAndUpdate(
    driverId,
    { skills },
    { new: true, runValidators: true }
  ).populate('authId', 'email name isActive is_block role');

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  return driver;
};
const createDriverByAdmin = async (payload: any) => {
  const {
    name,
    email,
    password,
    phone_number,
    license_number,
    vehicle_type,
    vehicle_plate,
    address,
    company_name,
    tax_number,
    vehicle_carrier_image,
    dealer_plate_image
  } = payload;

  const existingAuth = await Auth.findOne({ email }).lean();
  if (existingAuth) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  const authData = {
    role: ENUM_USER_ROLE.DRIVER,
    name,
    email,
    password, 
    isActive: true, 
    is_block: false
  };

  const createAuth = await Auth.create(authData);
  if (!createAuth) {
    throw new ApiError(500, "Failed to create auth account");
  }

  const driverData = {
    authId: createAuth._id,
    name,
    email,
    phone_number,
    license_number,
    vehicle_type,
    vehicle_plate,
    address,
    company_name,
    tax_number,
    vehicle_carrier_image,
    dealer_plate_image,
    status: 'approved', 
  };

  const driver = await Drivers.create(driverData);
  return driver;
};

const updateDocumentByAdmin = async (
  driverId: string,
  files: Record<string, Express.Multer.File[]>,
  adminName: string
) => {
  const driver = await Drivers.findById(driverId);
  if (!driver) throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');

  const licenseFile = files?.license_document?.[0];
  const idFile = files?.id_document?.[0];
  const contractFile = files?.contract_document?.[0];

  const updateData: Record<string, any> = {};
  const newActivity: any[] = [];

  if (licenseFile) {
    updateData.license_document = licenseFile.path;
    updateData.license_status = 'pending';
    newActivity.push({ message: 'License document uploaded', by: adminName, date: new Date() });
  }
  if (idFile) {
    updateData.id_document = idFile.path;
    updateData.id_status = 'pending';
    newActivity.push({ message: 'ID document uploaded', by: adminName, date: new Date() });
  }
  if (contractFile) {
    updateData.contract_document = contractFile.path;
    updateData.contract_status = 'pending';
    newActivity.push({ message: 'Contract document uploaded', by: adminName, date: new Date() });
  }

  if (newActivity.length > 0) {
    updateData.$push = { document_activity: { $each: newActivity } };
  }

  const updated = await Drivers.findByIdAndUpdate(driverId, updateData, { new: true });
  return updated;
};

const deleteDocumentByAdmin = async (driverId: string, documentType: string, adminName: string) => {
  const allowedTypes = ['license_document', 'id_document', 'contract_document'];
  if (!allowedTypes.includes(documentType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document type');
  }

  const statusField = documentType.replace('_document', '_status');

  const updateData: any = {
    [documentType]: null,
    [statusField]: 'pending',
    $push: {
      document_activity: {
        message: `${documentType.replace('_', ' ')} deleted`,
        by: adminName,
        date: new Date()
      }
    }
  };

  const updated = await Drivers.findByIdAndUpdate(driverId, updateData, { new: true });
  return updated;
};

const updateDocumentStatus = async (
  driverId: string,
  documentType: string,
  status: 'pending' | 'verified' | 'rejected',
  message?: string,
  adminName?: string
) => {
  const allowedTypes = ['license_document', 'id_document', 'contract_document', 'vehicle_carrier_image', 'dealer_plate_image'];
  if (!allowedTypes.includes(documentType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document type');
  }

  // Map document type to its status field
  const statusFieldMap: Record<string, string> = {
    license_document: 'license_status',
    id_document: 'id_status',
    contract_document: 'contract_status',
    vehicle_carrier_image: 'vehicle_carrier_status',
    dealer_plate_image: 'dealer_plate_status',
  };

  const statusField = statusFieldMap[documentType];
  const readableName = documentType.replace(/_/g, ' ');
  const activityMessage = message
    ? `${readableName} marked as ${status} - ${message}`
    : `${readableName} marked as ${status}`;

  const updateData: any = {
    [statusField]: status,
    $push: {
      document_activity: {
        message: activityMessage,
        by: adminName || 'Admin',
        date: new Date()
      }
    }
  };

  const updated = await Drivers.findByIdAndUpdate(driverId, updateData, { new: true });
  return updated;
};


const updateAdminNotes = async (driverId: string, notes: string) => {
  const updated = await Drivers.findByIdAndUpdate(
    driverId,
    { admin_notes: notes },
    { new: true }
  );
  return updated;
};

export const DriverService = {
  getAllDrivers,
  getDriverById,
  getMyDriverProfile,
  submitDriverDocuments,
  updateDriverStatus,
  updateDriverLocation,
  updateProfileImage,
  updateMySkills,
  updateMyProfile,
  deleteMyDocument,
  createDriverByAdmin,
  updateDocumentByAdmin,
  deleteDocumentByAdmin,
  updateDocumentStatus,
  updateAdminNotes,
};
