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

  driver.totalDeliveries = totalDeliveries;

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

  driver.totalDeliveries = totalDeliveries;

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

  if (!driver.documents_submitted && status === 'approved') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Driver has not submitted documents yet'
    );
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
};
