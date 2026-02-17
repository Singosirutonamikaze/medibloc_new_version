/**
 * Constantes des routes de l'application
 */

// Routes publiques
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '/404',
} as const;

// Routes Admin
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  PATIENTS: '/admin/patients',
  DOCTORS: '/admin/doctors',
  APPOINTMENTS: '/admin/appointments',
  DISEASES: '/admin/diseases',
  SYMPTOMS: '/admin/symptoms',
  MEDICINES: '/admin/medicines',
  PHARMACIES: '/admin/pharmacies',
  PRESCRIPTIONS: '/admin/prescriptions',
  MEDICAL_RECORDS: '/admin/medical-records',
  STATS: '/admin/stats',
} as const;

// Routes Doctor
export const DOCTOR_ROUTES = {
  DASHBOARD: '/doctor/dashboard',
  PATIENTS: '/doctor/patients',
  APPOINTMENTS: '/doctor/appointments',
  PRESCRIPTIONS: '/doctor/prescriptions',
  MEDICAL_RECORDS: '/doctor/medical-records',
} as const;

// Routes Patient
export const PATIENT_ROUTES = {
  DASHBOARD: '/patient/dashboard',
  PROFILE: '/patient/profile',
  APPOINTMENTS: '/patient/appointments',
  DISEASES: '/patient/diseases',
  PRESCRIPTIONS: '/patient/prescriptions',
  MEDICAL_RECORDS: '/patient/medical-records',
} as const;

// Regroupement de toutes les routes
export const ROUTES = {
  PUBLIC: PUBLIC_ROUTES,
  ADMIN: ADMIN_ROUTES,
  DOCTOR: DOCTOR_ROUTES,
  PATIENT: PATIENT_ROUTES,
} as const;
