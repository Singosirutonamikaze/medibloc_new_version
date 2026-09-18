/**
 * @file prescription.interface.ts
 * @description Interfaces pour les ordonnances medicales et prescriptions.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Prescription, Patient, Doctor } from "@prisma/client";

/**
 * @interface DetailedPrescription
 * @description Ordonnance medicale completee des identites patient et praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant unique de l'ordonnance.
 * @property doctorId Identifiant du praticien prescripteur.
 * @property patientId Identifiant du patient beneficiaire.
 * @property medications Description detaillee des posologies et medicaments.
 * @property diagnosis Diagnostic clinique associe.
 * @property notes Recommandations therapeutiques additionnelles.
 * @property issuedAt Date et heure d'emission.
 */
export interface DetailedPrescription extends Prescription {
  readonly patient?: Patient & {
    readonly user?: {
      readonly firstName: string;
      readonly lastName: string;
      readonly email: string;
    };
  };
  readonly doctor?: Doctor & {
    readonly specialty?: string | null;
    readonly user?: {
      readonly firstName: string;
      readonly lastName: string;
      readonly email: string;
    };
  };
}

export type { Prescription };
