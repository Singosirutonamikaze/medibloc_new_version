import type { Role } from '../common/common.types';
import type { Patient } from '../patient/patient.types';
import type { Doctor } from '../doctor/doctor.types';

export interface Message {
  id: number;
  discussionId: number;
  senderRole: Role;
  content?: string;
  fileUrl?: string;
  isRead: boolean;
  readAt?: string;
  sentAt: string;
  deletedAt?: string;
}

export interface Discussion {
  id: number;
  patientId: number;
  doctorId: number;
  createdAt: string;
  doctor?: Doctor;
  patient?: Patient;
  messages?: Message[];
}

export interface CreateDiscussionDto {
  patientId: number;
  doctorId: number;
}

export interface CreateMessageDto {
  senderRole: Role;
  content?: string;
  fileUrl?: string;
}
