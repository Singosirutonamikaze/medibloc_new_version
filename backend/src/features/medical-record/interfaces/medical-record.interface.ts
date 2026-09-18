/**
 * @file medical-record.interface.ts
 * @description Interfaces pour les dossiers medicaux et observations cliniques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { MedicalRecord, Patient } from "@prisma/client";

/**
 * @interface DetailedMedicalRecord
 * @description Dossier medical incluant les coordonnees du patient associe.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant numerique unique du dossier.
 * @property patientId Identifiant du patient.
 * @property title Titre ou intitule de l'entree clinique.
 * @property content Contenu detaille ou compte-rendu medical.
 * @property files Chemins ou URLs des documents et examens attaches.
 * @property createdAt Date de creation.
 * @property patient Profil patient lie.
 */
export interface DetailedMedicalRecord extends MedicalRecord {
  readonly patient?: Patient & {
    readonly user?: {
      readonly firstName: string;
      readonly lastName: string;
      readonly email: string;
    };
  };
}

export type { MedicalRecord };
