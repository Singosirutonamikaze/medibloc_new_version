import type { IconType } from 'react-icons';
import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiThermometer,
  FiPackage,
  FiShoppingBag,
  FiFileText,
  FiFolder,
  FiBarChart2,
  FiActivity,
} from 'react-icons/fi';
import {
  ADMIN_ROUTES,
  DOCTOR_ROUTES,
  PATIENT_ROUTES,
} from '../../../utils/constants/routes.constants';
import type { Role } from '../../../types';

export interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

export const navConfig: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard',         path: ADMIN_ROUTES.DASHBOARD,       icon: FiGrid },
    { label: 'Utilisateurs',      path: ADMIN_ROUTES.USERS,           icon: FiUsers },
    { label: 'Patients',          path: ADMIN_ROUTES.PATIENTS,        icon: FiUser },
    { label: 'Médecins',          path: ADMIN_ROUTES.DOCTORS,         icon: FiActivity },
    { label: 'Rendez-vous',       path: ADMIN_ROUTES.APPOINTMENTS,    icon: FiCalendar },
    { label: 'Maladies',          path: ADMIN_ROUTES.DISEASES,        icon: FiAlertCircle },
    { label: 'Symptômes',         path: ADMIN_ROUTES.SYMPTOMS,        icon: FiThermometer },
    { label: 'Médicaments',       path: ADMIN_ROUTES.MEDICINES,       icon: FiPackage },
    { label: 'Pharmacies',        path: ADMIN_ROUTES.PHARMACIES,      icon: FiShoppingBag },
    { label: 'Ordonnances',       path: ADMIN_ROUTES.PRESCRIPTIONS,   icon: FiFileText },
    { label: 'Dossiers médicaux', path: ADMIN_ROUTES.MEDICAL_RECORDS, icon: FiFolder },
    { label: 'Statistiques',      path: ADMIN_ROUTES.STATS,           icon: FiBarChart2 },
  ],
  DOCTOR: [
    { label: 'Dashboard',         path: DOCTOR_ROUTES.DASHBOARD,       icon: FiGrid },
    { label: 'Mes patients',      path: DOCTOR_ROUTES.PATIENTS,        icon: FiUser },
    { label: 'Rendez-vous',       path: DOCTOR_ROUTES.APPOINTMENTS,    icon: FiCalendar },
    { label: 'Ordonnances',       path: DOCTOR_ROUTES.PRESCRIPTIONS,   icon: FiFileText },
    { label: 'Dossiers médicaux', path: DOCTOR_ROUTES.MEDICAL_RECORDS, icon: FiFolder },
  ],
  PATIENT: [
    { label: 'Dashboard',         path: PATIENT_ROUTES.DASHBOARD,       icon: FiGrid },
    { label: 'Mon profil',        path: PATIENT_ROUTES.PROFILE,         icon: FiUser },
    { label: 'Rendez-vous',       path: PATIENT_ROUTES.APPOINTMENTS,    icon: FiCalendar },
    { label: 'Mes maladies',      path: PATIENT_ROUTES.DISEASES,        icon: FiAlertCircle },
    { label: 'Ordonnances',       path: PATIENT_ROUTES.PRESCRIPTIONS,   icon: FiFileText },
    { label: 'Dossiers médicaux', path: PATIENT_ROUTES.MEDICAL_RECORDS, icon: FiFolder },
  ],
};
