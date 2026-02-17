import type { Patient } from '../patient/patient.types';

export interface MedicalRecord {
  id: number;
  patientId: number;
  recordDate: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
}

export interface CreateMedicalRecordDto {
  patientId: number;
  recordDate: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

export interface UpdateMedicalRecordDto {
  recordDate?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}
