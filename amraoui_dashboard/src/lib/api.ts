const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://amraoui-hiredriver-backends.vercel.app";

export const API_BASE = `${BACKEND_URL}/api/v1`;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("adminUser");
}

export function getProfileImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type ApiOptions = RequestInit & {
  auth?: boolean;
  skipAuthRedirect?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const { auth = false, skipAuthRedirect = false, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);

  if (auth) {
    const token = getToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  if (rest.body && !(rest.body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const finalUrl = `${API_BASE.trim()}${path.trim()}`;
  console.log(`[apiFetch] Requesting: ${finalUrl}`);
  const res = await fetch(finalUrl, {
    ...rest,
    headers: requestHeaders,
  });

  let data: T;
  try {
    data = await res.json();
  } catch {
    data = {} as T;
  }

  if (res.status === 401 && auth && !skipAuthRedirect && typeof window !== "undefined") {
    clearSession();
    window.location.href = "/login";
  }

  return { ok: res.ok, status: res.status, data };
}
