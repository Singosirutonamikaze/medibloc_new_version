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

export const InvoiceStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus];

export const PaymentMethod = {
  CARD: 'CARD',
  MOBILE_MONEY: 'MOBILE_MONEY',
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const NotificationType = {
  APPOINTMENT: 'APPOINTMENT',
  MESSAGE: 'MESSAGE',
  PAYMENT: 'PAYMENT',
  PRESCRIPTION: 'PRESCRIPTION',
  SYSTEM: 'SYSTEM',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const DayOfWeek = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
} as const;

export type DayOfWeek = typeof DayOfWeek[keyof typeof DayOfWeek];
