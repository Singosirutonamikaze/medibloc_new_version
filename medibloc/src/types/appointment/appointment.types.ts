import type { AppointmentStatus } from '../common/common.types';
import type { Patient } from '../patient/patient.types';
import type { Doctor } from '../doctor/doctor.types';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  reason?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  scheduledAt?: string;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}
