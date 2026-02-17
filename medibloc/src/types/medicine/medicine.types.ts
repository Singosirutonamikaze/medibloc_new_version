import type { MedicineType } from '../common/common.types';

export interface Medicine {
  id: number;
  name: string;
  description?: string;
  dosage?: string;
  sideEffects?: string;
  type: MedicineType;
  pharmacyId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicineDto {
  name: string;
  description?: string;
  dosage?: string;
  sideEffects?: string;
  type: MedicineType;
  pharmacyId?: number;
}

export interface UpdateMedicineDto {
  name?: string;
  description?: string;
  dosage?: string;
  sideEffects?: string;
  type?: MedicineType;
  pharmacyId?: number;
}
