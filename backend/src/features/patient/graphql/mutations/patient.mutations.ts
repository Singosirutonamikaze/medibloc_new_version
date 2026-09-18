/**
 * @file patient.mutations.ts
 * @description Logique des mutations GraphQL pour les patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Patient } from "@prisma/client";
import { CreatePatientDto, UpdatePatientDto } from "../../dtos/patient.dto";
import { createPatient, updatePatient, deletePatient } from "../../services/patient.service";

/**
 * @description Cree un patient via mutation GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const createPatientMutation = async (
  _parent: object,
  args: { input: CreatePatientDto }
): Promise<Patient> => {
  return createPatient(args.input);
};

/**
 * @description Met a jour un patient via mutation GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const updatePatientMutation = async (
  _parent: object,
  args: { id: number; input: UpdatePatientDto }
): Promise<Patient> => {
  return updatePatient(args.id, args.input);
};

/**
 * @description Supprime un patient via mutation GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const deletePatientMutation = async (
  _parent: object,
  args: { id: number }
): Promise<Patient> => {
  return deletePatient(args.id);
};
