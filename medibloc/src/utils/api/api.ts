export const API_BASE_URL = 'https://medibloc-new-version.onrender.com';

// Configuration des endpoints pour l'authentification
const AUTH_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH: '/refresh',
  ME: '/me',
} as const;

// Configuration des endpoints pour les utilisateurs
const USERS_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  PROFILE_ME: '/profile/me',
} as const;

// Configuration des endpoints pour les patients
const PATIENTS_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  GET_DISEASES: (id: number) => `/${id}/diseases`,
  GET_APPOINTMENTS: (id: number) => `/${id}/appointments`,
  GET_PRESCRIPTIONS: (id: number) => `/${id}/prescriptions`,
} as const;

// Configuration des endpoints pour les médecins
const DOCTORS_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  GET_APPOINTMENTS: (id: number) => `/${id}/appointments`,
  GET_PRESCRIPTIONS: (id: number) => `/${id}/prescriptions`,
  GET_SPECIALTIES: '/specialties/list',
} as const;

// Configuration des endpoints pour les rendez-vous
const APPOINTMENTS_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  UPDATE_STATUS: (id: number) => `/${id}/status`,
  GET_BY_PATIENT: (patientId: number) => `/patient/${patientId}`,
  GET_BY_DOCTOR: (doctorId: number) => `/doctor/${doctorId}`,
} as const;

// Configuration des endpoints pour les maladies
const DISEASES_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  GET_SYMPTOMS: (id: number) => `/${id}/symptoms`,
  GET_COUNTRIES: (id: number) => `/${id}/countries`,
  ADD_SYMPTOM: (diseaseId: number, symptomId: number) => `/${diseaseId}/symptoms/${symptomId}`,
  REMOVE_SYMPTOM: (diseaseId: number, symptomId: number) => `/${diseaseId}/symptoms/${symptomId}`,
} as const;

// Configuration des endpoints pour les symptômes
const SYMPTOMS_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  GET_DISEASES: (id: number) => `/${id}/diseases`,
} as const;

// Configuration des endpoints pour les médicaments
const MEDICINES_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  GET_BY_TYPE: (type: string) => `/type/${type}`,
  GET_BY_PHARMACY: (pharmacyId: number) => `/pharmacy/${pharmacyId}`,
} as const;

// Configuration des endpoints pour les pharmacies
const PHARMACIES_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  GET_BY_COUNTRY: (countryId: number) => `/country/${countryId}`,
  GET_MEDICINES: (id: number) => `/${id}/medicines`,
} as const;

// Configuration des endpoints pour les ordonnances
const PRESCRIPTIONS_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  DELETE: (id: number) => `/${id}`,
  GET_BY_PATIENT: (patientId: number) => `/patient/${patientId}`,
  GET_BY_DOCTOR: (doctorId: number) => `/doctor/${doctorId}`,
} as const;

// Configuration des endpoints pour les dossiers médicaux
const MEDICAL_RECORDS_ENDPOINTS = {
  GET_ALL: '/',
  GET_BY_ID: (id: number) => `/${id}`,
  CREATE: '/',
  UPDATE: (id: number) => `/${id}`,
  DELETE: (id: number) => `/${id}`,
  GET_BY_PATIENT: (patientId: number) => `/patient/${patientId}`,
} as const;

// Configuration des endpoints pour les statistiques
const STATS_ENDPOINTS = {
  DASHBOARD: '/dashboard',
  DISEASES: '/diseases',
  APPOINTMENTS: '/appointments',
  PATIENTS: '/patients',
} as const;

// Export de tous les endpoints avec le préfixe API
export const ENDPOINTS = {
  AUTH: {
    BASE: '/api/v1/auth',
    ...AUTH_ENDPOINTS,
  },
  USERS: {
    BASE: '/api/v1/users',
    ...USERS_ENDPOINTS,
  },
  PATIENTS: {
    BASE: '/api/v1/patients',
    ...PATIENTS_ENDPOINTS,
  },
  DOCTORS: {
    BASE: '/api/v1/doctors',
    ...DOCTORS_ENDPOINTS,
  },
  APPOINTMENTS: {
    BASE: '/api/v1/appointments',
    ...APPOINTMENTS_ENDPOINTS,
  },
  DISEASES: {
    BASE: '/api/v1/diseases',
    ...DISEASES_ENDPOINTS,
  },
  SYMPTOMS: {
    BASE: '/api/v1/symptoms',
    ...SYMPTOMS_ENDPOINTS,
  },
  MEDICINES: {
    BASE: '/api/v1/medicines',
    ...MEDICINES_ENDPOINTS,
  },
  PHARMACIES: {
    BASE: '/api/v1/pharmacies',
    ...PHARMACIES_ENDPOINTS,
  },
  PRESCRIPTIONS: {
    BASE: '/api/v1/prescriptions',
    ...PRESCRIPTIONS_ENDPOINTS,
  },
  MEDICAL_RECORDS: {
    BASE: '/api/v1/medical-records',
    ...MEDICAL_RECORDS_ENDPOINTS,
  },
  STATS: {
    BASE: '/api/v1/stats',
    ...STATS_ENDPOINTS,
  },
} as const;

// Types utilitaires pour l'utilisation des endpoints
export type EndpointKey = keyof typeof ENDPOINTS;

// Helper function pour construire une URL complète
export const buildUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};