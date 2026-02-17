import type { Role } from '../common/common.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
