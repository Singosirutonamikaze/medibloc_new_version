import type { Role } from '../common/common.types';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}
