import { apiFetch, getProfileImageUrl } from "./api";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface BackendDriver {
  _id: string;
  name: string;
  email: string;
  phone_number?: string;
  license_number?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  profile_image?: string | null;
  status: "pending" | "approved" | "declined";
  documents_submitted?: boolean;
  license_document?: string | null;
  id_document?: string | null;
  contract_document?: string | null;
  decline_reason?: string | null;
  totalDeliveries?: number;
  rating?: number | null;
  createdAt?: string;
  authId?: {
    email?: string;
    name?: string;
    isActive?: boolean;
    is_block?: boolean;
  };
}

export function getDocumentUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getDrivers(params: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);

  const { ok, data } = await apiFetch<
    ApiResponse<{ drivers: BackendDriver[]; meta: { total: number; page: number; limit: number } }>
  >(`/drivers?${query.toString()}`, { auth: true });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to load drivers");
  }

  return data.data!;
}

export async function getDriverById(id: string) {
  const { ok, data } = await apiFetch<ApiResponse<BackendDriver>>(`/drivers/${id}`, {
    auth: true,
  });

  if (!ok || !data.success || !data.data) {
    throw new Error(data.message || "Failed to load driver");
  }

  return data.data;
}

export async function updateDriverStatus(
  id: string,
  status: "approved" | "declined",
  reason?: string
) {
  const { ok, data } = await apiFetch<ApiResponse<BackendDriver>>(`/drivers/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status, reason }),
  });

  if (!ok || !data.success) {
    throw new Error(data.message || "Failed to update driver status");
  }

  return data.data;
}

export function mapDriverStatusLabel(status: string): string {
  if (status === "approved") return "Verified";
  if (status === "declined") return "Suspended";
  if (status === "pending") return "Pending Approval";
  return status;
}

export { getProfileImageUrl };
