/**
 * @file doctor.queries.ts
 * @description Logique des requetes GraphQL pour les praticiens.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { DetailedDoctor } from "../../interfaces/doctor.interface";
import { findAllDoctors, findDoctorById, findDoctorSpecialties } from "../../services/doctor.service";

/**
 * @description Recupere la liste des medecins.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const doctorsQuery = async (): Promise<DetailedDoctor[]> => {
  return findAllDoctors();
};

/**
 * @description Recupere un medecin par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const doctorQuery = async (
  _parent: object,
  args: { id: number }
): Promise<DetailedDoctor | null> => {
  try {
    return await findDoctorById(args.id);
  } catch {
    return null;
  }
};

/**
 * @description Recupere les specialites medicales.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const specialtiesQuery = async (): Promise<string[]> => {
  return findDoctorSpecialties();
};
