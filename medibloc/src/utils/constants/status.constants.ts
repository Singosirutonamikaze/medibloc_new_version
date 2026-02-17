import { AppointmentStatus, DiseaseStatus, DiseaseSeverity, MedicineType } from '../../types';

/**
 * Labels des statuts de rendez-vous en français
 */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: 'En attente',
  [AppointmentStatus.CONFIRMED]: 'Confirmé',
  [AppointmentStatus.CANCELLED]: 'Annulé',
  [AppointmentStatus.COMPLETED]: 'Terminé',
};

/**
 * Labels des statuts de maladie en français
 */
export const DISEASE_STATUS_LABELS: Record<DiseaseStatus, string> = {
  [DiseaseStatus.ACTIVE]: 'Active',
  [DiseaseStatus.IN_REMISSION]: 'En rémission',
  [DiseaseStatus.CURED]: 'Guérie',
  [DiseaseStatus.CHRONIC]: 'Chronique',
};

/**
 * Labels de la sévérité des maladies en français
 */
export const DISEASE_SEVERITY_LABELS: Record<DiseaseSeverity, string> = {
  [DiseaseSeverity.MILD]: 'Légère',
  [DiseaseSeverity.MODERATE]: 'Modérée',
  [DiseaseSeverity.SEVERE]: 'Sévère',
  [DiseaseSeverity.CRITICAL]: 'Critique',
};

/**
 * Labels des types de médicaments en français
 */
export const MEDICINE_TYPE_LABELS: Record<MedicineType, string> = {
  [MedicineType.PHARMACEUTICAL]: 'Pharmaceutique',
  [MedicineType.HERBAL]: 'Médicament à base de plantes',
};

/**
 * Couleurs des statuts de rendez-vous
 */
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: '#FFA500',
  [AppointmentStatus.CONFIRMED]: '#4CAF50',
  [AppointmentStatus.CANCELLED]: '#F44336',
  [AppointmentStatus.COMPLETED]: '#2196F3',
};
