export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  profile_image: string | null;
}

export function saveSession(accessToken: string, user: AdminSession): void {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("adminUser", JSON.stringify(user));
}

export function getSession(): AdminSession | null {
  const raw = localStorage.getItem("adminUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function isAdminRole(role: string | undefined): role is AdminRole {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function extractRoleFromUser(user: Record<string, unknown>): AdminRole | null {
  const authId = user.authId as Record<string, unknown> | undefined;
  const role = (authId?.role as string) || (user.role as string);
  return isAdminRole(role) ? role : null;
}
