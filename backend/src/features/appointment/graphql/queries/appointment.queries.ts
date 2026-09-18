/**
 * @file appointment.queries.ts
 * @description Logique des requetes GraphQL pour les rendez-vous medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { DetailedAppointment } from "../../interfaces/appointment.interface";
import {
  findAllAppointments,
  findAppointmentById,
  findPatientAppointments,
  findDoctorAppointments,
} from "../../services/appointment.service";

/**
 * @description Recupere la liste de l'ensemble des rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const appointmentsQuery = async (): Promise<DetailedAppointment[]> => {
  return findAllAppointments();
};

/**
 * @description Recupere un rendez-vous par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const appointmentQuery = async (
  _parent: object,
  args: { id: number }
): Promise<DetailedAppointment | null> => {
  try {
    return await findAppointmentById(args.id);
  } catch {
    return null;
  }
};

/**
 * @description Recupere les rendez-vous d'un patient donne.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const patientAppointmentsQuery = async (
  _parent: object,
  args: { patientId: number }
): Promise<DetailedAppointment[]> => {
  return findPatientAppointments(args.patientId);
};

/**
 * @description Recupere les rendez-vous d'un medecin donne.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const doctorAppointmentsQuery = async (
  _parent: object,
  args: { doctorId: number }
): Promise<DetailedAppointment[]> => {
  return findDoctorAppointments(args.doctorId);
};
