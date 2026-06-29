import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import Auth from '../auth/auth.model';
import { BlockUnblockPayload, PaginationQuery } from './admin.interface';
import Admin from './admin.model';
import { ENUM_USER_ROLE } from '../../../enums/user';
import Customers from '../customers/customers.model';
import Drivers from '../drivers/drivers.model';
import { AuthService } from '../auth/auth.service';
import sendEmail from '../../../utils/sendEmail';

// ─── Block / Unblock any user ────────────────────────
const blockUnblockAuthUser = async (payload: BlockUnblockPayload) => {
  const { role, email, is_block } = payload;

  const updatedAuth = await Auth.findOneAndUpdate(
    { email, role },
    { $set: { is_block } },
    { new: true, runValidators: true }
  ).select('role name email is_block');

  if (!updatedAuth) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const statusValue = is_block ? 'deactivate' : 'active';

  switch (role) {
    case ENUM_USER_ROLE.CUSTOMERS:
      await Customers.findOneAndUpdate(
        { authId: updatedAuth._id },
        { $set: { status: statusValue } }
      );
      break;
    case ENUM_USER_ROLE.DRIVER:
      await Drivers.findOneAndUpdate(
        { authId: updatedAuth._id },
        { $set: { status: is_block ? 'declined' : 'approved' } }
      );
      break;
    case ENUM_USER_ROLE.ADMIN:
    case ENUM_USER_ROLE.SUPER_ADMIN:
      // Admin profile has no explicit status field; blocking the Auth record is enough
      break;
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
  }

  return updatedAuth;
};

// ─── Get all customers ───────────────────────────────
const getAllCustomers = async (query: PaginationQuery) => {
  const { page = 1, limit = 10, search, status } = query;

  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [customers, total] = await Promise.all([
    Customers.find(filter)
      .populate('authId', 'email name isActive is_block createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Customers.countDocuments(filter),
  ]);

  return {
    customers,
    meta: { total, page: Number(page), limit: Number(limit) },
  };
};

// ─── Get single customer ─────────────────────────────
const getCustomerById = async (customerId: string) => {
  const customer = await Customers.findById(customerId).populate(
    'authId',
    'email name isActive is_block createdAt'
  );
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  return customer;
};

// ─── Get all admins ──────────────────────────────────
const getAllAdmins = async (query: PaginationQuery) => {
  const { page = 1, limit = 10, search } = query;

  const filter: Record<string, any> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [admins, total] = await Promise.all([
    Admin.find(filter)
      .populate('authId', 'email name isActive is_block role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Admin.countDocuments(filter),
  ]);

  return {
    admins,
    meta: { total, page: Number(page), limit: Number(limit) },
  };
};

// ─── Dashboard overview stats ────────────────────────
const getDashboardStats = async () => {
  const [
    totalCustomers,
    totalDrivers,
    pendingDrivers,
    approvedDrivers,
    declinedDrivers,
    totalAdmins,
  ] = await Promise.all([
    Customers.countDocuments(),
    Drivers.countDocuments(),
    Drivers.countDocuments({ status: 'pending' }),
    Drivers.countDocuments({ status: 'approved' }),
    Drivers.countDocuments({ status: 'declined' }),
    Admin.countDocuments(),
  ]);

  return {
    totalCustomers,
    totalDrivers,
    pendingDrivers,
    approvedDrivers,
    declinedDrivers,
    totalAdmins,
  };
};

// ─── Approve customer ────────────────────────
const approveCustomer = async (customerId: string) => {
  const customer = await Customers.findByIdAndUpdate(
    customerId,
    { status: 'active' },
    { new: true, runValidators: true }
  ).populate('authId');

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }

  // Send an approval email
  if (customer.email) {
    sendEmail({
      email: customer.email,
      subject: "Account Approved",
      html: `<h2>Welcome to Vehiqqo!</h2><p>Your account has been approved by the admin. You can now log in to the portal.</p>`,
    }).catch(console.error);
  }

  return customer;
};

// ─── Create Customer manually ────────────────
const createCustomer = async (payload: any) => {
   const authResponse = await AuthService.registrationAccount({
      ...payload,
      role: ENUM_USER_ROLE.CUSTOMERS,
   });

   if (authResponse?.result?._id) {
       await Customers.findByIdAndUpdate(authResponse.result._id, { status: 'active' });
       if (authResponse.result.authId) {
         await Auth.findByIdAndUpdate(authResponse.result.authId, { isActive: true });
       }
   }

   return authResponse.result;
};

export const AdminService = {
  blockUnblockAuthUser,
  getAllCustomers,
  getCustomerById,
  getAllAdmins,
  getDashboardStats,
  approveCustomer,
  createCustomer,
};
