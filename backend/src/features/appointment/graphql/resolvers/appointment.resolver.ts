/**
 * @file appointment.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour le domaine des rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import {
  appointmentsQuery,
  appointmentQuery,
  patientAppointmentsQuery,
  doctorAppointmentsQuery,
} from "../queries/appointment.queries";
import {
  createAppointmentMutation,
  updateAppointmentMutation,
  updateAppointmentStatusMutation,
  deleteAppointmentMutation,
} from "../mutations/appointment.mutations";

export const appointmentResolvers = {
  Query: {
    appointments: appointmentsQuery,
    appointment: appointmentQuery,
    patientAppointments: patientAppointmentsQuery,
    doctorAppointments: doctorAppointmentsQuery,
  },
  Mutation: {
    createAppointment: createAppointmentMutation,
    updateAppointment: updateAppointmentMutation,
    updateAppointmentStatus: updateAppointmentStatusMutation,
    deleteAppointment: deleteAppointmentMutation,
  },
};

export default appointmentResolvers;
