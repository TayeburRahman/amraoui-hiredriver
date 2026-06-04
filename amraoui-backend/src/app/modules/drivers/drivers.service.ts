import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import Drivers from './drivers.model';
import Auth from '../auth/auth.model';
import { ENUM_USER_ROLE } from '../../../enums/user';

// ─── Get all drivers (admin use) ──────────────────────
const getAllDrivers = async (query: Record<string, any>) => {
  const { status, page = 1, limit = 10 } = query;

  const filter: Record<string, any> = {};
  if (status) filter.status = status;

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

// ─── Get single driver profile ────────────────────────
const getDriverById = async (driverId: string) => {
  const driver = await Drivers.findById(driverId).populate(
    'authId',
    'email name isActive is_block'
  );
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  return driver;
};

// ─── Approve / Decline driver (admin) ────────────────
const updateDriverStatus = async (
  driverId: string,
  status: 'approved' | 'declined'
) => {
  const driver = await Drivers.findByIdAndUpdate(
    driverId,
    { status },
    { new: true, runValidators: true }
  ).populate('authId', 'email name');

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  // If approved, activate auth account
  if (status === 'approved') {
    await Auth.findByIdAndUpdate(driver.authId, { isActive: true });
  }

  return driver;
};

// ─── Update driver location ───────────────────────────
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

export const DriverService = {
  getAllDrivers,
  getDriverById,
  updateDriverStatus,
  updateDriverLocation,
};
