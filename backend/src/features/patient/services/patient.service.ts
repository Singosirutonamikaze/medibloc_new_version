/**
 * @file patient.service.ts
 * @description Logique metier pure et acces donnees Prisma pour la gestion des patients.
 * Respecte les standards stricts sans structures conditionnelles directes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Patient, PatientDisease, Disease, Appointment, Prescription } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreatePatientDto, UpdatePatientDto } from "../dtos/patient.dto";
import { DetailedPatient } from "../interfaces/patient.interface";

/**
 * @description Recupere la liste de tous les patients avec leurs informations utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Collection de profils {@link DetailedPatient}.
 */
export const findAllPatients = async (): Promise<DetailedPatient[]> => {
  return prisma.patient.findMany({
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
    },
    orderBy: { id: "asc" },
  });
};

/**
 * @description Recherche un profil patient complet par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du patient.
 * @returns Profil enrichi {@link DetailedPatient}.
 * @throws Error Lorsque le patient n'existe pas.
 */
export const findPatientById = async (id: number): Promise<DetailedPatient> => {
  const patient = await prisma.patient.findUnique({
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
      diseases: { include: { disease: true } },
      appointments: { orderBy: { scheduledAt: "desc" } },
      prescriptions: { orderBy: { issuedAt: "desc" } },
    },
  });

  const actionMap: Record<string, () => DetailedPatient> = {
    true: () => patient as DetailedPatient,
    false: () => {
      throw new Error("Patient introuvable");
    },
  };

  const isFound = Boolean(patient);
  return actionMap[String(isFound)]();
};

/**
 * @description Cree un profil patient associe a un compte utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees de creation {@link CreatePatientDto}.
 * @returns Instance persistee {@link Patient}.
 */
export const createPatient = async (dto: CreatePatientDto): Promise<Patient> => {
  return prisma.patient.create({
    data: {
      userId: dto.userId,
      ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
      ...(dto.gender ? { gender: dto.gender } : {}),
      ...(dto.phone ? { phone: dto.phone } : {}),
      ...(dto.address ? { address: dto.address } : {}),
    },
    include: {
      user: true,
    },
  });
};

/**
 * @description Met a jour les coordonnees et informations d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du patient.
 * @param dto Donnees modifiees {@link UpdatePatientDto}.
 * @returns Profil patient mis a jour.
 */
export const updatePatient = async (
  id: number,
  dto: UpdatePatientDto
): Promise<Patient> => {
  return prisma.patient.update({
    where: { id },
    data: {
      ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
      ...(dto.gender ? { gender: dto.gender } : {}),
      ...(dto.phone ? { phone: dto.phone } : {}),
      ...(dto.address ? { address: dto.address } : {}),
    },
    include: {
      user: true,
    },
  });
};

/**
 * @description Supprime le profil d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du patient.
 * @returns Profil patient supprime.
 */
export const deletePatient = async (id: number): Promise<Patient> => {
  return prisma.patient.delete({
    where: { id },
  });
};

/**
 * @description Recupere l'historique des pathologies diagnostiquees d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param patientId Identifiant du patient.
 * @returns Collection des pathologies avec details de la maladie.
 */
export const findPatientDiseases = async (
  patientId: number
): Promise<(PatientDisease & { disease: Disease })[]> => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      diseases: { include: { disease: true } },
    },
  });

  const actionMap: Record<string, () => (PatientDisease & { disease: Disease })[]> = {
    true: () => (patient as { diseases: (PatientDisease & { disease: Disease })[] }).diseases,
    false: () => {
      throw new Error("Patient introuvable");
    },
  };

  return actionMap[String(Boolean(patient))]();
};

/**
 * @description Recupere tous les rendez-vous d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param patientId Identifiant du patient.
 * @returns Liste des rendez-vous.
 */
export const findPatientAppointmentsList = async (
  patientId: number
): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    where: { patientId },
    orderBy: { scheduledAt: "desc" },
  });
};

/**
 * @description Recupere l'ensemble des ordonnances delivrees a un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param patientId Identifiant du patient.
 * @returns Liste des ordonnances.
 */
export const findPatientPrescriptionsList = async (
  patientId: number
): Promise<Prescription[]> => {
  return prisma.prescription.findMany({
    where: { patientId },
    orderBy: { issuedAt: "desc" },
  });
};
