import api from '@/lib/axios';

// ─── Registration ──────────────────────────────
export const registerCustomer = async (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await api.post('/auth/register', { ...data, role: 'CUSTOMERS' });
  return response.data;
};

// ─── OTP Activation ────────────────────────────
export const activateAccount = async (data: {
  userEmail: string;
  activation_code: string;
}) => {
  const response = await api.post('/auth/activate-user', data);
  return response.data;
};

// ─── Resend Activation Code ────────────────────
export const resendActivationCode = async (email: string) => {
  const response = await api.post('/auth/active-resend', { email });
  return response.data;
};

// ─── Login ─────────────────────────────────────
export const loginCustomer = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// ─── Forgot Password ───────────────────────────
export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// ─── Verify Reset OTP ──────────────────────────
export const verifyResetOtp = async (data: {
  email: string;
  code: string;
}) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

// ─── Resend Forgot OTP ─────────────────────────
export const resendForgotOtp = async (email: string) => {
  const response = await api.post('/auth/resend-forgot', { email });
  return response.data;
};

// ─── Reset Password ────────────────────────────
export const resetPassword = async (
  email: string,
  data: { newPassword: string; confirmPassword: string }
) => {
  const response = await api.post(`/auth/reset-password?email=${email}`, data);
  return response.data;
};

// ─── Get My Profile ────────────────────────────
export const getMyProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// ─── Update My Profile ─────────────────────────
export const updateMyProfile = async (formData: FormData) => {
  const response = await api.patch('/auth/edit-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ─── Change Password ───────────────────────────
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await api.patch('/auth/change-password', data);
  return response.data;
};

// ─── Delete Account ────────────────────────────
export const deleteMyAccount = async () => {
  const response = await api.delete('/auth/delete-account');
  return response.data;
};
