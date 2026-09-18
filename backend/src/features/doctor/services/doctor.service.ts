/**
 * @file doctor.service.ts
 * @description Logique metier pure et requetes Prisma pour la gestion des praticiens.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Doctor, Appointment, Prescription } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateDoctorDto, UpdateDoctorDto } from "../dtos/doctor.dto";
import { DetailedDoctor } from "../interfaces/doctor.interface";

/**
 * @description Recupere l'ensemble des medecins avec leurs informations utilisateurs et disponibilites.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Collection de {@link DetailedDoctor}.
 */
export const findAllDoctors = async (): Promise<DetailedDoctor[]> => {
  return prisma.doctor.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      availabilities: true,
      timeOffs: true,
    },
    orderBy: { id: "asc" },
  });
};

/**
 * @description Recherche un praticien par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du praticien.
 * @returns Instance enrichie {@link DetailedDoctor}.
 * @throws Error Lorsque le medecin est introuvable.
 */
export const findDoctorById = async (id: number): Promise<DetailedDoctor> => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      availabilities: true,
      timeOffs: true,
      appointments: { orderBy: { scheduledAt: "asc" } },
      prescriptions: { orderBy: { issuedAt: "desc" } },
    },
  });

  const actionMap: Record<string, () => DetailedDoctor> = {
    true: () => doctor as DetailedDoctor,
    false: () => {
      throw new Error("Medecin introuvable");
    },
  };

  return actionMap[String(Boolean(doctor))]();
};

/**
 * @description Cree un profil praticien pour un compte utilisateur existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees de creation {@link CreateDoctorDto}.
 * @returns Instance persistee {@link Doctor}.
 */
export const createDoctor = async (dto: CreateDoctorDto): Promise<Doctor> => {
  return prisma.doctor.create({
    data: {
      userId: dto.userId,
      ...(dto.specialty ? { specialty: dto.specialty } : {}),
      ...(dto.phone ? { phone: dto.phone } : {}),
    },
    include: {
      user: true,
    },
  });
};

/**
 * @description Met a jour les informations d'un praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du praticien.
 * @param dto Donnees modifiees {@link UpdateDoctorDto}.
 * @returns Profil mis a jour.
 */
export const updateDoctor = async (
  id: number,
  dto: UpdateDoctorDto
): Promise<Doctor> => {
  return prisma.doctor.update({
    where: { id },
    data: {
      ...(dto.specialty ? { specialty: dto.specialty } : {}),
      ...(dto.phone ? { phone: dto.phone } : {}),
    },
    include: {
      user: true,
    },
  });
};

/**
 * @description Supprime le profil d'un praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du praticien.
 * @returns Profil supprime.
 */
export const deleteDoctor = async (id: number): Promise<Doctor> => {
  return prisma.doctor.delete({
    where: { id },
  });
};

/**
 * @description Liste l'ensemble des specialites medicales distinctes enregistrees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Tableau de noms de specialites.
 */
export const findDoctorSpecialties = async (): Promise<string[]> => {
  const doctors = await prisma.doctor.findMany({
    select: { specialty: true },
  });

  const rawSpecialties = doctors
    .map((d: { specialty: string | null }): string => d.specialty || "")
    .filter((s: string): boolean => s.length > 0);

  return Array.from(new Set(rawSpecialties));
};

/**
 * @description Recupere les rendez-vous d'un medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param doctorId Identifiant du praticien.
 * @returns Liste de rendez-vous.
 */
export const findDoctorAppointmentsList = async (
  doctorId: number
): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    where: { doctorId },
    include: {
      patient: { include: { user: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });
};

/**
 * @description Recupere les ordonnances emises par un medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param doctorId Identifiant du praticien.
 * @returns Liste d'ordonnances.
 */
export const findDoctorPrescriptionsList = async (
  doctorId: number
): Promise<Prescription[]> => {
  return prisma.prescription.findMany({
    where: { doctorId },
    include: {
      patient: { include: { user: true } },
    },
    orderBy: { issuedAt: "desc" },
  });
};
