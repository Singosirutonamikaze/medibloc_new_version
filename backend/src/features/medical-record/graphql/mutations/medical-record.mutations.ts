/**
 * @file medical-record.mutations.ts
 * @description Mutations GraphQL pour les dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { MedicalRecord } from "@prisma/client";
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from "../../dtos/medical-record.dto";
import {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../../services/medical-record.service";

/**
 * @description Cree une entree de dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const createMedicalRecordMutation = async (
  _parent: object,
  args: { input: CreateMedicalRecordDto }
): Promise<MedicalRecord> => {
  return createMedicalRecord(args.input);
};

/**
 * @description Met a jour une entree de dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const updateMedicalRecordMutation = async (
  _parent: object,
  args: { id: number; input: UpdateMedicalRecordDto }
): Promise<MedicalRecord> => {
  return updateMedicalRecord(args.id, args.input);
};

/**
 * @description Supprime une entree de dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const deleteMedicalRecordMutation = async (
  _parent: object,
  args: { id: number }
): Promise<MedicalRecord> => {
  return deleteMedicalRecord(args.id);
};
