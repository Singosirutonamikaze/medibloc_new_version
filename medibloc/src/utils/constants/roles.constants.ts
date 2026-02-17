import { Role } from '../../types';

/**
 * Constantes des rôles
 */

export const ROLES = {
  ADMIN: Role.ADMIN,
  DOCTOR: Role.DOCTOR,
  PATIENT: Role.PATIENT,
} as const;

/**
 * Labels des rôles en français
 */
export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrateur',
  [Role.DOCTOR]: 'Médecin',
  [Role.PATIENT]: 'Patient',
};

/**
 * Routes par défaut selon le rôle
 */
export const ROLE_DEFAULT_ROUTES: Record<Role, string> = {
  [Role.ADMIN]: '/admin/dashboard',
  [Role.DOCTOR]: '/doctor/dashboard',
  [Role.PATIENT]: '/patient/dashboard',
};
