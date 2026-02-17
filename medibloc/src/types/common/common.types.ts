// Types communs utilisés à travers l'application

export const Role = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export const DiseaseStatus = {
  ACTIVE: 'ACTIVE',
  IN_REMISSION: 'IN_REMISSION',
  CURED: 'CURED',
  CHRONIC: 'CHRONIC',
} as const;

export type DiseaseStatus = typeof DiseaseStatus[keyof typeof DiseaseStatus];

export const DiseaseSeverity = {
  MILD: 'MILD',
  MODERATE: 'MODERATE',
  SEVERE: 'SEVERE',
  CRITICAL: 'CRITICAL',
} as const;

export type DiseaseSeverity = typeof DiseaseSeverity[keyof typeof DiseaseSeverity];

export const MedicineType = {
  PHARMACEUTICAL: 'PHARMACEUTICAL',
  HERBAL: 'HERBAL',
} as const;

export type MedicineType = typeof MedicineType[keyof typeof MedicineType];

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

export interface PaginationParams {
  page?: number;
  limit?: number;
}
