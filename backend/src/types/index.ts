import { Request } from 'express';
import { Role, Gender, AppointmentStatus, DiseaseStatus, DiseaseSeverity, MedicineType } from '@prisma/client';

// ============================================
// TYPES DE BASE ET UTILITAIRES
// ============================================

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: Role;
}

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// TYPES AUTHENTIFICATION
// ============================================

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload extends AuthenticatedUser {}

// ============================================
// TYPES PATIENT
// ============================================

export interface CreatePatientDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate?: string; // Use string for ISO date format
  gender?: Gender;
  phone?: string;
  address?: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}

export interface PatientResponse {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}

// ============================================
// TYPES DOCTOR
// ============================================

export interface CreateDoctorDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  phone?: string;
}

export interface UpdateDoctorDto {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  phone?: string;
}

export interface DoctorResponse {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
  specialty?: string;
  phone?: string;
}

// ============================================
// TYPES APPOINTMENT
// ============================================

export interface CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  scheduledAt: string; // ISO date string
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  scheduledAt?: string;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface AppointmentResponse {
  id: number;
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  reason?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty?: string;
  };
}

// ============================================
// TYPES DISEASE
// ============================================

export interface CreateDiseaseDto {
  name: string;
  description?: string;
  isViral?: boolean;
  isBacterial?: boolean;
  isGenetic?: boolean;
  isChronic?: boolean;
}

export interface UpdateDiseaseDto {
  name?: string;
  description?: string;
  isViral?: boolean;
  isBacterial?: boolean;
  isGenetic?: boolean;
  isChronic?: boolean;
}

export interface DiseaseResponse {
  id: number;
  name: string;
  description?: string;
  isViral: boolean;
  isBacterial: boolean;
  isGenetic: boolean;
  isChronic: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TYPES SYMPTOM
// ============================================

export interface CreateSymptomDto {
  name: string;
  description?: string;
}

export interface UpdateSymptomDto {
  name?: string;
  description?: string;
}

export interface SymptomResponse {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

// ============================================
// TYPES MEDICINE
// ============================================

export interface CreateMedicineDto {
  name: string;
  type: MedicineType;
  description?: string;
  composition?: string;
  scientificName?: string;
  commonNames?: string[];
  pharmacyId?: number;
  sideEffects?: string[];
  contraindications?: string[];
}

export interface UpdateMedicineDto {
  name?: string;
  type?: MedicineType;
  description?: string;
  composition?: string;
  scientificName?: string;
  commonNames?: string[];
  pharmacyId?: number;
  sideEffects?: string[];
  contraindications?: string[];
}

export interface MedicineResponse {
  id: number;
  name: string;
  type: MedicineType;
  description?: string;
  composition?: string;
  scientificName?: string;
  commonNames: string[];
  pharmacyId?: number;
  sideEffects: string[];
  contraindications: string[];
  createdAt: string;
  updatedAt: string;
  pharmacy?: {
    name: string;
    city: string;
  };
}

// ============================================
// TYPES PHARMACY
// ============================================

export interface CreatePharmacyDto {
  name: string;
  address: string;
  city: string;
  countryId: number;
  phone?: string;
  email?: string;
}

export interface UpdatePharmacyDto {
  name?: string;
  address?: string;
  city?: string;
  countryId?: number;
  phone?: string;
  email?: string;
}

export interface PharmacyResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  countryId: number;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  country: {
    name: string;
    code: string;
  };
}

// ============================================
// TYPES PRESCRIPTION
// ============================================

export interface CreatePrescriptionDto {
  doctorId: number;
  patientId: number;
  medications: string;
  diagnosis?: string;
  notes?: string;
}

export interface PrescriptionResponse {
  id: number;
  doctorId: number;
  patientId: number;
  medications: string;
  diagnosis?: string;
  notes?: string;
  issuedAt: string;
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty?: string;
  };
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

// ============================================
// TYPES MEDICAL RECORD
// ============================================

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

export interface MedicalRecordResponse {
  id: number;
  patientId: number;
  title: string;
  content: string;
  files: string[];
  createdAt: string;
}

// ============================================
// TYPES PATIENT DISEASE
// ============================================

export interface CreatePatientDiseaseDto {
  patientId: number;
  diseaseId: number;
  status?: DiseaseStatus;
  severity?: DiseaseSeverity;
  notes?: string;
}

export interface UpdatePatientDiseaseDto {
  status?: DiseaseStatus;
  severity?: DiseaseSeverity;
  notes?: string;
}

export interface PatientDiseaseResponse {
  id: number;
  patientId: number;
  diseaseId: number;
  diagnosedAt: string;
  status: DiseaseStatus;
  severity: DiseaseSeverity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  disease: DiseaseResponse;
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

// ============================================
// TYPES FILTRES ET RECHERCHE
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentFilter extends PaginationParams {
  patientId?: number;
  doctorId?: number;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
}

export interface PatientFilter extends PaginationParams {
  search?: string;
  gender?: Gender;
}

export interface MedicineFilter extends PaginationParams {
  type?: MedicineType;
  search?: string;
  pharmacyId?: number;
}

// ============================================
// TYPES STATISTIQUES
// ============================================

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  upcomingAppointments: number;
  recentPrescriptions: number;
}

export interface DiseaseStats {
  diseaseId: number;
  diseaseName: string;
  totalCases: number;
  activeCases: number;
  curedCases: number;
}

// ============================================
// TYPES FORMULAIRES ET VALIDATION
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AppointmentFormData {
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  reason: string;
  notes?: string;
}

// ============================================
// TYPES ERREURS
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: ValidationError[];
  code?: number;
}


export type SanitizedUser = Omit<User, 'password'>;