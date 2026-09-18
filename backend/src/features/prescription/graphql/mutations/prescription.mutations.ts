/**
 * @file prescription.mutations.ts
 * @description Mutations GraphQL pour les ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Prescription } from "@prisma/client";
import { CreatePrescriptionDto, UpdatePrescriptionDto } from "../../dtos/prescription.dto";
import {
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../../services/prescription.service";

/**
 * @description Cree une ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const createPrescriptionMutation = async (
  _parent: object,
  args: { input: CreatePrescriptionDto }
): Promise<Prescription> => {
  return createPrescription(args.input);
};

/**
 * @description Met a jour une ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const updatePrescriptionMutation = async (
  _parent: object,
  args: { id: number; input: UpdatePrescriptionDto }
): Promise<Prescription> => {
  return updatePrescription(args.id, args.input);
};

/**
 * @description Supprime une ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const deletePrescriptionMutation = async (
  _parent: object,
  args: { id: number }
): Promise<Prescription> => {
  return deletePrescription(args.id);
};
