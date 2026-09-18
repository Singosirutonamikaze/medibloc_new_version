/**
 * @file doctor.mutations.ts
 * @description Logique des mutations GraphQL pour les praticiens.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Doctor } from "@prisma/client";
import { CreateDoctorDto, UpdateDoctorDto } from "../../dtos/doctor.dto";
import { createDoctor, updateDoctor, deleteDoctor } from "../../services/doctor.service";

/**
 * @description Cree un medecin via mutation GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const createDoctorMutation = async (
  _parent: object,
  args: { input: CreateDoctorDto }
): Promise<Doctor> => {
  return createDoctor(args.input);
};

/**
 * @description Met a jour un medecin via mutation GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const updateDoctorMutation = async (
  _parent: object,
  args: { id: number; input: UpdateDoctorDto }
): Promise<Doctor> => {
  return updateDoctor(args.id, args.input);
};

/**
 * @description Supprime un medecin via mutation GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const deleteDoctorMutation = async (
  _parent: object,
  args: { id: number }
): Promise<Doctor> => {
  return deleteDoctor(args.id);
};
