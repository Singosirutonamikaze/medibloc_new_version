import type { Patient } from '../patient/patient.types';

export interface MedicalRecord {
  id: number;
  patientId: number;
  title: string;
  content: string;
  files: string[];
  createdAt: string;
  patient?: Patient;
}

export interface CreateMedicalRecordDto {
  patientId: number;
  title: string;
  content: string;
  files?: string[];
}

export interface UpdateMedicalRecordDto {
  title?: string;
  content?: string;
  files?: string[];
}
