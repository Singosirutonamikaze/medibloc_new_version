export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string ?? '';

// URL de base pour les fichiers statiques (ex: retire /api/v1 du chemin de l'API)
export const FILE_BASE_URL = API_BASE_URL.replace('/api/v1', '');

// Les chemins sont relatifs à la baseURL de l'apiClient (/api/v1)
// Chaque endpoint inclut le préfixe de ressource pour être utilisable directement

// Configuration des endpoints pour l'authentification
const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

// Configuration des endpoints pour les utilisateurs
const USERS_ENDPOINTS = {
  GET_ALL: '/users',
  GET_BY_ID: (id: number) => `/users/${id}`,
  CREATE: '/auth/register',
  UPDATE: (id: number) => `/users/${id}`,
  DELETE: (id: number) => `/users/${id}`,
  PROFILE_ME: '/users/profile/me',
  UPLOAD_AVATAR: (id: number) => `/users/${id}/avatar`,
  DELETE_AVATAR: (id: number) => `/users/${id}/avatar`,
} as const;

// Configuration des endpoints pour les patients
const PATIENTS_ENDPOINTS = {
  GET_ALL: '/patients',
  GET_BY_ID: (id: number) => `/patients/${id}`,
  CREATE: '/patients',
  UPDATE: (id: number) => `/patients/${id}`,
  DELETE: (id: number) => `/patients/${id}`,
  GET_DISEASES: (id: number) => `/patients/${id}/diseases`,
  GET_APPOINTMENTS: (id: number) => `/patients/${id}/appointments`,
  GET_PRESCRIPTIONS: (id: number) => `/patients/${id}/prescriptions`,
} as const;

// Configuration des endpoints pour les médecins
const DOCTORS_ENDPOINTS = {
  GET_ALL: '/doctors',
  GET_BY_ID: (id: number) => `/doctors/${id}`,
  CREATE: '/doctors',
  UPDATE: (id: number) => `/doctors/${id}`,
  DELETE: (id: number) => `/doctors/${id}`,
  GET_APPOINTMENTS: (id: number) => `/doctors/${id}/appointments`,
  GET_PRESCRIPTIONS: (id: number) => `/doctors/${id}/prescriptions`,
  GET_SPECIALTIES: '/doctors/specialties/list',
} as const;

// Configuration des endpoints pour les rendez-vous
const APPOINTMENTS_ENDPOINTS = {
  GET_ALL: '/appointments',
  GET_BY_ID: (id: number) => `/appointments/${id}`,
  CREATE: '/appointments',
  UPDATE: (id: number) => `/appointments/${id}`,
  DELETE: (id: number) => `/appointments/${id}`,
  UPDATE_STATUS: (id: number) => `/appointments/${id}/status`,
  GET_BY_PATIENT: (patientId: number) => `/appointments/patient/${patientId}`,
  GET_BY_DOCTOR: (doctorId: number) => `/appointments/doctor/${doctorId}`,
} as const;

// Configuration des endpoints pour les maladies
const DISEASES_ENDPOINTS = {
  GET_ALL: '/diseases',
  GET_BY_ID: (id: number) => `/diseases/${id}`,
  CREATE: '/diseases',
  UPDATE: (id: number) => `/diseases/${id}`,
  DELETE: (id: number) => `/diseases/${id}`,
  GET_SYMPTOMS: (id: number) => `/diseases/${id}/symptoms`,
  GET_COUNTRIES: (id: number) => `/diseases/${id}/countries`,
  ADD_SYMPTOM: (diseaseId: number, symptomId: number) => `/diseases/${diseaseId}/symptoms/${symptomId}`,
  REMOVE_SYMPTOM: (diseaseId: number, symptomId: number) => `/diseases/${diseaseId}/symptoms/${symptomId}`,
} as const;

// Configuration des endpoints pour les symptômes
const SYMPTOMS_ENDPOINTS = {
  GET_ALL: '/symptoms',
  GET_BY_ID: (id: number) => `/symptoms/${id}`,
  CREATE: '/symptoms',
  UPDATE: (id: number) => `/symptoms/${id}`,
  DELETE: (id: number) => `/symptoms/${id}`,
  GET_DISEASES: (id: number) => `/symptoms/${id}/diseases`,
} as const;

// Configuration des endpoints pour les médicaments
const MEDICINES_ENDPOINTS = {
  GET_ALL: '/medicines',
  GET_BY_ID: (id: number) => `/medicines/${id}`,
  CREATE: '/medicines',
  UPDATE: (id: number) => `/medicines/${id}`,
  DELETE: (id: number) => `/medicines/${id}`,
  GET_BY_TYPE: (type: string) => `/medicines/type/${type}`,
  GET_BY_PHARMACY: (pharmacyId: number) => `/medicines/pharmacy/${pharmacyId}`,
} as const;

// Configuration des endpoints pour les pharmacies
const PHARMACIES_ENDPOINTS = {
  GET_ALL: '/pharmacies',
  GET_BY_ID: (id: number) => `/pharmacies/${id}`,
  CREATE: '/pharmacies',
  UPDATE: (id: number) => `/pharmacies/${id}`,
  DELETE: (id: number) => `/pharmacies/${id}`,
  GET_BY_COUNTRY: (countryId: number) => `/pharmacies/country/${countryId}`,
  GET_MEDICINES: (id: number) => `/pharmacies/${id}/medicines`,
} as const;

// Configuration des endpoints pour les ordonnances
const PRESCRIPTIONS_ENDPOINTS = {
  GET_ALL: '/prescriptions',
  GET_BY_ID: (id: number) => `/prescriptions/${id}`,
  CREATE: '/prescriptions',
  UPDATE: (id: number) => `/prescriptions/${id}`,
  DELETE: (id: number) => `/prescriptions/${id}`,
  GET_BY_PATIENT: (patientId: number) => `/prescriptions/patient/${patientId}`,
  GET_BY_DOCTOR: (doctorId: number) => `/prescriptions/doctor/${doctorId}`,
  GET_MEDICINES: (id: number) => `/prescriptions/${id}/medicines`,
} as const;

// Configuration des endpoints pour les dossiers médicaux
const MEDICAL_RECORDS_ENDPOINTS = {
  GET_ALL: '/medical-records',
  GET_BY_ID: (id: number) => `/medical-records/${id}`,
  CREATE: '/medical-records',
  UPDATE: (id: number) => `/medical-records/${id}`,
  DELETE: (id: number) => `/medical-records/${id}`,
  GET_BY_PATIENT: (patientId: number) => `/medical-records/patient/${patientId}`,
  GET_BY_DOCTOR: (doctorId: number) => `/medical-records/doctor/${doctorId}`,
  GET_BY_APPOINTMENT: (appointmentId: number) => `/medical-records/appointment/${appointmentId}`,
} as const;

// Configuration des endpoints pour les hotspots épidémiologiques
const HOTSPOTS_ENDPOINTS = {
  GET_ALL: '/hotspots',
  GET_DISEASES: '/hotspots/diseases',
  HEALTH: '/hotspots/health',
} as const;

// Configuration des endpoints pour les statistiques
const STATS_ENDPOINTS = {
  DASHBOARD: '/stats/dashboard',
  DISEASES: '/stats/diseases',
  APPOINTMENTS: '/stats/appointments',
  PATIENTS: '/stats/patients',
} as const;

// Export de tous les endpoints
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USERS: USERS_ENDPOINTS,
  PATIENTS: PATIENTS_ENDPOINTS,
  DOCTORS: DOCTORS_ENDPOINTS,
  APPOINTMENTS: APPOINTMENTS_ENDPOINTS,
  DISEASES: DISEASES_ENDPOINTS,
  SYMPTOMS: SYMPTOMS_ENDPOINTS,
  MEDICINES: MEDICINES_ENDPOINTS,
  PHARMACIES: PHARMACIES_ENDPOINTS,
  PRESCRIPTIONS: PRESCRIPTIONS_ENDPOINTS,
  MEDICAL_RECORDS: MEDICAL_RECORDS_ENDPOINTS,
  HOTSPOTS: HOTSPOTS_ENDPOINTS,
  STATS: STATS_ENDPOINTS,
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