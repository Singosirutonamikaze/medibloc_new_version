/**
 * @file medical-record.queries.ts
 * @description Requetes GraphQL pour les dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { DetailedMedicalRecord } from "../../interfaces/medical-record.interface";
import {
  findAllMedicalRecords,
  findMedicalRecordById,
  findPatientMedicalRecordsList,
} from "../../services/medical-record.service";

/**
 * @description Recupere tous les dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const medicalRecordsQuery = async (): Promise<DetailedMedicalRecord[]> => {
  return findAllMedicalRecords();
};

/**
 * @description Recupere un dossier medical par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const medicalRecordQuery = async (
  _parent: object,
  args: { id: number }
): Promise<DetailedMedicalRecord | null> => {
  try {
    return await findMedicalRecordById(args.id);
  } catch {
    return null;
  }
};

/**
 * @description Recupere les dossiers medicaux d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const patientMedicalRecordsQuery = async (
  _parent: object,
  args: { patientId: number }
): Promise<DetailedMedicalRecord[]> => {
  return findPatientMedicalRecordsList(args.patientId);
};
