/**
 * @file prescription.dto.ts
 * @description Objets de transfert de donnees pour la delivrance et modification d'ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

/**
 * @interface CreatePrescriptionDto
 * @description Donnees de redaction d'une ordonnance medicale.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property doctorId Identifiant du praticien prescripteur.
 * @property patientId Identifiant du patient concerne.
 * @property medications Traitements prescrits et posologie.
 * @property diagnosis Diagnostic clinique observe.
 * @property notes Indications et consignes de suivi.
 */
export interface CreatePrescriptionDto {
  readonly doctorId: number;
  readonly patientId: number;
  readonly medications: string;
  readonly diagnosis?: string;
  readonly notes?: string;
}

/**
 * @interface UpdatePrescriptionDto
 * @description Donnees modifiables sur une ordonnance existante.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdatePrescriptionDto {
  readonly medications?: string;
  readonly diagnosis?: string;
  readonly notes?: string;
}
