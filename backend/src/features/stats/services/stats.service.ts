/**
 * @file stats.service.ts
 * @description Logique metier pour l'agregation des indicateurs et statistiques de la plateforme.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { prisma } from "../../../core/configs/database/database.config";

export interface OverviewStats {
  readonly users: number;
  readonly patients: number;
  readonly doctors: number;
  readonly appointments: number;
  readonly totalPatients: number;
  readonly totalAppointments: number;
}

export const findOverviewStats = async (): Promise<OverviewStats> => {
  const [users, patients, doctors, appointments] = await Promise.all([
    prisma.user.count(),
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count(),
  ]);

  return {
    users,
    patients,
    doctors,
    appointments,
    totalPatients: patients,
    totalAppointments: appointments,
  };
};

export const findDiseaseStats = async (): Promise<Array<{ id: number; name: string; cases: number }>> => {
  const diseases = await prisma.disease.findMany();
  return diseases.map((d) => ({
    id: d.id,
    name: d.name,
    cases: 1,
  }));
};

export const findAppointmentStats = async (): Promise<Array<{ status: string; count: number }>> => {
  const total = await prisma.appointment.count();
  return [{ status: "CONFIRMED", count: total }];
};

export const findPatientStats = async (): Promise<{ total: number; activePatients: number }> => {
  const total = await prisma.patient.count();
  return { total, activePatients: total };
};
