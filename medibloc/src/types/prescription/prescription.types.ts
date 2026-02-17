import type { Patient } from '../patient/patient.types';
import type { Doctor } from '../doctor/doctor.types';

export interface Prescription {
  id: number;
  patientId: number;
  doctorId: number;
  medications: string;
  dosage?: string;
  duration?: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface CreatePrescriptionDto {
  patientId: number;
  doctorId: number;
  medications: string;
  dosage?: string;
  duration?: string;
  instructions?: string;
}

export interface UpdatePrescriptionDto {
  medications?: string;
  dosage?: string;
  duration?: string;
  instructions?: string;
}
