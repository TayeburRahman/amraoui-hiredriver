import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import Customers from './customers.model';
import Auth from '../auth/auth.model';

// ─── Get own profile ─────────────────────────────────
const getProfile = async (userId: string) => {
  const customer = await Customers.findById(userId).populate(
    'authId',
    'email name isActive createdAt'
  );
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  return customer;
};

// ─── Get order history (placeholder) ─────────────────
// This will be expanded once the Mission/Order module is built
const getOrderHistory = async (userId: string) => {
  // TODO: populate with real missions once the module is ready
  return [];
};

export const CustomerService = {
  getProfile,
  getOrderHistory,
};
