/**
 * @file prescription.queries.ts
 * @description Requetes GraphQL pour les ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { DetailedPrescription } from "../../interfaces/prescription.interface";
import {
  findAllPrescriptions,
  findPrescriptionById,
  findPatientPrescriptionsList,
  findDoctorPrescriptionsList,
} from "../../services/prescription.service";

/**
 * @description Recupere toutes les ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const prescriptionsQuery = async (): Promise<DetailedPrescription[]> => {
  return findAllPrescriptions();
};

/**
 * @description Recupere une ordonnance par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const prescriptionQuery = async (
  _parent: object,
  args: { id: number }
): Promise<DetailedPrescription | null> => {
  try {
    return await findPrescriptionById(args.id);
  } catch {
    return null;
  }
};

/**
 * @description Recupere les ordonnances d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const patientPrescriptionsQuery = async (
  _parent: object,
  args: { patientId: number }
): Promise<DetailedPrescription[]> => {
  return findPatientPrescriptionsList(args.patientId);
};

/**
 * @description Recupere les ordonnances d'un medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const doctorPrescriptionsQuery = async (
  _parent: object,
  args: { doctorId: number }
): Promise<DetailedPrescription[]> => {
  return findDoctorPrescriptionsList(args.doctorId);
};
