/**
 * @file appointment.mutations.ts
 * @description Logique des mutations GraphQL pour les rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Appointment, AppointmentStatus } from "@prisma/client";
import { CreateAppointmentDto, UpdateAppointmentDto } from "../../dtos/appointment.dto";
import {
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../../services/appointment.service";

/**
 * @description Mutation GraphQL de creation de rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const createAppointmentMutation = async (
  _parent: object,
  args: { input: CreateAppointmentDto }
): Promise<Appointment> => {
  return createAppointment(args.input);
};

/**
 * @description Mutation GraphQL de mise a jour de rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const updateAppointmentMutation = async (
  _parent: object,
  args: { id: number; input: UpdateAppointmentDto }
): Promise<Appointment> => {
  return updateAppointment(args.id, args.input);
};

/**
 * @description Mutation GraphQL de changement de statut.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const updateAppointmentStatusMutation = async (
  _parent: object,
  args: { id: number; status: AppointmentStatus }
): Promise<Appointment> => {
  return updateAppointmentStatus(args.id, args.status);
};

/**
 * @description Mutation GraphQL de suppression de rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const deleteAppointmentMutation = async (
  _parent: object,
  args: { id: number }
): Promise<Appointment> => {
  return deleteAppointment(args.id);
};
