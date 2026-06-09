import { apiFetch } from "./api";
import { AdminSession, extractRoleFromUser, isAdminRole, saveSession } from "./auth";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function loginAdmin(email: string, password: string) {
  const { ok, data } = await apiFetch<ApiResponse<{ accessToken: string; user: Record<string, unknown> }>>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );

  if (!ok || !data.success || !data.data) {
    throw new Error(data.message || "Login failed. Please check your credentials.");
  }

  const { accessToken, user } = data.data;
  const role = extractRoleFromUser(user);

  if (!role) {
    throw new Error("Access denied. Only admin accounts can log in here.");
  }

  const session: AdminSession = {
    id: (user._id as string) || "",
    name: (user.name as string) || "",
    email: (user.email as string) || email,
    role,
    profile_image: (user.profile_image as string) || null,
  };

  saveSession(accessToken, session);
  return session;
}

export async function forgotPassword(email: string) {
  const { ok, data } = await apiFetch<ApiResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to send reset code.");
  }

  return data;
}

export async function resendForgotOtp(email: string) {
  const { ok, data } = await apiFetch<ApiResponse>("/auth/resend-forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to resend code.");
  }

  return data;
}

export async function verifyResetOtp(email: string, code: string) {
  const { ok, data } = await apiFetch<ApiResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Invalid or expired OTP code.");
  }

  return data;
}

export async function resetPassword(
  email: string,
  payload: { newPassword: string; confirmPassword: string }
) {
  const { ok, data } = await apiFetch<ApiResponse>(
    `/auth/reset-password?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to reset password.");
  }

  return data;
}

export async function getMyProfile() {
  const { ok, data } = await apiFetch<ApiResponse<Record<string, unknown>>>("/auth/profile", {
    auth: true,
  });

  if (!ok || !data.success || !data.data) {
    throw new Error(data.message || "Failed to load profile.");
  }

  return data.data;
}

export async function updateMyProfile(formData: FormData) {
  const { ok, data } = await apiFetch<ApiResponse<Record<string, unknown>>>("/auth/edit-profile", {
    method: "PATCH",
    auth: true,
    body: formData,
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to update profile.");
  }

  return data.data;
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const { ok, data } = await apiFetch<ApiResponse>("/auth/change-password", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to change password.");
  }

  return data;
}

export async function getAdmins() {
  const { ok, data } = await apiFetch<
    ApiResponse<{ admins: Record<string, unknown>[]; meta: Record<string, unknown> }>
  >("/admin/admins", { auth: true });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to load admins.");
  }

  return data.data?.admins || [];
}

export async function createAdmin(payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
}) {
  const { ok, data } = await apiFetch<ApiResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...payload, role: "ADMIN" }),
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to create admin.");
  }

  return data;
}

export async function toggleBlockAdmin(email: string, is_block: boolean) {
  const { ok, data } = await apiFetch<ApiResponse>("/auth/block-unblock", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ email, role: "ADMIN", is_block }),
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to update admin status.");
  }

  return data;
}

export function updateStoredSession(updates: Partial<AdminSession>): void {
  const raw = localStorage.getItem("adminUser");
  if (!raw) return;
  try {
    const user = JSON.parse(raw);
    localStorage.setItem("adminUser", JSON.stringify({ ...user, ...updates }));
  } catch {
    // ignore
  }
}

export { isAdminRole };
