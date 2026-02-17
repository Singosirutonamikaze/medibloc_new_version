import type { User } from '../user/user.types';

export interface Doctor {
  id: number;
  userId: number;
  specialty?: string;
  phone?: string;
  user?: User;
}

export interface CreateDoctorDto {
  userId: number;
  specialty?: string;
  phone?: string;
}

export interface UpdateDoctorDto {
  specialty?: string;
  phone?: string;
}
