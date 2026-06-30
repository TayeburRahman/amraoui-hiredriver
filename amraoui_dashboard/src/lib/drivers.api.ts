import { apiFetch, getProfileImageUrl, getToken } from "./api";

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
  address?: string;
  license_number?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  profile_image?: string | null;
  status: "pending" | "approved" | "declined";
  documents_submitted?: boolean;
  license_document?: string | null;
  id_document?: string | null;
  contract_document?: string | null;
  vehicle_carrier_image?: string | null;
  dealer_plate_image?: string | null;
  company_name?: string | null;
  tax_number?: string | null;
  decline_reason?: string | null;
  totalDeliveries?: number;
  rating?: number | null;
  successRate?: number;
  createdAt?: string;
  admin_notes?: string;
  license_status?: 'pending' | 'verified' | 'rejected';
  id_status?: 'pending' | 'verified' | 'rejected';
  contract_status?: 'pending' | 'verified' | 'rejected';
  vehicle_carrier_status?: 'pending' | 'verified' | 'rejected';
  dealer_plate_status?: 'pending' | 'verified' | 'rejected';
  document_activity?: { message: string; by: string; date: string }[];
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
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "https://amraoui-hiredriver-backends.vercel.app";
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

export async function adminCreateDriver(data: any) {
  const { ok, data: resData } = await apiFetch<ApiResponse<BackendDriver>>(`/drivers`, {
    method: "POST",
    auth: true,
    body: data instanceof FormData ? data : JSON.stringify(data),
  });

  if (!ok || !resData.success) {
    throw new Error(resData.message || "Failed to create driver");
  }

  return resData.data;
}

export async function adminUploadDocument(driverId: string, documentType: string, file: File) {
  const formData = new FormData();
  formData.append(documentType, file);

  const token = getToken();
  const headers = new Headers();
  if (token) headers.append("Authorization", `Bearer ${token}`);

  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "https://amraoui-hiredriver-backends.vercel.app";
  const response = await fetch(`${base}/api/v1/drivers/${driverId}/documents`, {
    method: "PATCH",
    headers,
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Failed to upload document");
  }

  return resData.data;
}

export async function adminDeleteDocument(driverId: string, documentType: string) {
  const { ok, data: resData } = await apiFetch<ApiResponse<BackendDriver>>(`/drivers/${driverId}/documents/delete`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ documentType }),
  });

  if (!ok || !resData.success) {
    throw new Error(resData.message || "Failed to delete document");
  }

  return resData.data;
}

export async function adminUpdateDocumentStatus(driverId: string, documentType: string, status: string, message?: string) {
  const { ok, data: resData } = await apiFetch<ApiResponse<BackendDriver>>(`/drivers/${driverId}/documents/status`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ documentType, status, message }),
  });

  if (!ok || !resData.success) {
    throw new Error(resData.message || "Failed to update document status");
  }

  return resData.data;
}

export async function adminUpdateNotes(driverId: string, notes: string) {
  const { ok, data: resData } = await apiFetch<ApiResponse<BackendDriver>>(`/drivers/${driverId}/notes`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ notes }),
  });

  if (!ok || !resData.success) {
    throw new Error(resData.message || "Failed to update admin notes");
  }

  return resData.data;
}

export { getProfileImageUrl };
