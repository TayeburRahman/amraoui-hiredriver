export type Role = 'CUSTOMERS' | 'ADMIN' | 'SUPER_ADMIN' | 'DRIVER';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  profile_image?: string | null;
  phone_number?: string;
  authId?: {
    _id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    profile_image?: string | null;
  };
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
