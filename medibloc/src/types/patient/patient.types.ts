import type { Gender } from '../common/common.types';
import type { User } from '../user/user.types';

export interface Patient {
  id: number;
  userId: number;
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  user?: User;
}

export interface CreatePatientDto {
  userId: number;
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}

export interface UpdatePatientDto {
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}
