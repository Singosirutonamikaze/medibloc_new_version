import type { Patient } from '../patient/patient.types';
import type { Doctor } from '../doctor/doctor.types';
import type { Appointment } from '../appointment/appointment.types';

export interface Review {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  doctor?: Doctor;
  patient?: Patient;
  appointment?: Appointment;
}

export interface CreateReviewDto {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  rating: number;
  comment?: string;
}
