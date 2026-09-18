/**
 * @file patient.queries.ts
 * @description Logique des requetes GraphQL pour les patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { DetailedPatient } from "../../interfaces/patient.interface";
import { findAllPatients, findPatientById } from "../../services/patient.service";

/**
 * @description Recupere l'ensemble des profils patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const patientsQuery = async (): Promise<DetailedPatient[]> => {
  return findAllPatients();
};

/**
 * @description Recupere un profil patient par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const patientQuery = async (
  _parent: object,
  args: { id: number }
): Promise<DetailedPatient | null> => {
  try {
    return await findPatientById(args.id);
  } catch {
    return null;
  }
};
