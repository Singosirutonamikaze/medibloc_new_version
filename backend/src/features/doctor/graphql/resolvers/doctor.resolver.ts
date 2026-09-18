/**
 * @file doctor.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour le domaine docteur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { doctorsQuery, doctorQuery, specialtiesQuery } from "../queries/doctor.queries";
import {
  createDoctorMutation,
  updateDoctorMutation,
  deleteDoctorMutation,
} from "../mutations/doctor.mutations";

export const doctorResolvers = {
  Query: {
    doctors: doctorsQuery,
    doctor: doctorQuery,
    specialties: specialtiesQuery,
  },
  Mutation: {
    createDoctor: createDoctorMutation,
    updateDoctor: updateDoctorMutation,
    deleteDoctor: deleteDoctorMutation,
  },
};

export default doctorResolvers;
