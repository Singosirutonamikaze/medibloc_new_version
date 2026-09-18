/**
 * @file prescription.service.ts
 * @description Logique metier pure et requetes Prisma pour la delivrance et gestion des ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Prescription } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreatePrescriptionDto, UpdatePrescriptionDto } from "../dtos/prescription.dto";
import { DetailedPrescription } from "../interfaces/prescription.interface";

/**
 * @description Recupere l'ensemble des ordonnances medicales avec les donnees patient et praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Collection de {@link DetailedPrescription}.
 */
export const findAllPrescriptions = async (): Promise<DetailedPrescription[]> => {
  return prisma.prescription.findMany({
    include: {
      patient: {
        include: {
          user: true,
        },
      },
      doctor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });
};

/**
 * @description Recherche une ordonnance par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant unique de l'ordonnance.
 * @returns Ordonnance detaillee {@link DetailedPrescription}.
 * @throws Error Lorsque l'ordonnance est introuvable.
 */
export const findPrescriptionById = async (id: number): Promise<DetailedPrescription> => {
  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });

  const actionMap: Record<string, () => DetailedPrescription> = {
    true: () => prescription as DetailedPrescription,
    false: () => {
      throw new Error("Ordonnance introuvable");
    },
  };

  return actionMap[String(Boolean(prescription))]();
};

/**
 * @description Enregistre une nouvelle ordonnance medicale.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees d'ordonnance {@link CreatePrescriptionDto}.
 * @returns Ordonnance creee.
 */
export const createPrescription = async (
  dto: CreatePrescriptionDto
): Promise<Prescription> => {
  return prisma.prescription.create({
    data: {
      doctorId: dto.doctorId,
      patientId: dto.patientId,
      medications: dto.medications,
      diagnosis: dto.diagnosis || null,
      notes: dto.notes || null,
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * @description Met a jour une ordonnance medicale.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de l'ordonnance.
 * @param dto Donnees a modifier {@link UpdatePrescriptionDto}.
 * @returns Ordonnance mise a jour.
 */
export const updatePrescription = async (
  id: number,
  dto: UpdatePrescriptionDto
): Promise<Prescription> => {
  return prisma.prescription.update({
    where: { id },
    data: {
      ...(dto.medications ? { medications: dto.medications } : {}),
      ...(dto.diagnosis ? { diagnosis: dto.diagnosis } : {}),
      ...(dto.notes ? { notes: dto.notes } : {}),
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * @description Supprime une ordonnance medicale.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de l'ordonnance.
 * @returns Ordonnance supprimee.
 */
export const deletePrescription = async (id: number): Promise<Prescription> => {
  return prisma.prescription.delete({
    where: { id },
  });
};

/**
 * @description Liste les ordonnances attribuees a un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param patientId Identifiant du patient.
 * @returns Liste ordonnee des ordonnances.
 */
export const findPatientPrescriptionsList = async (
  patientId: number
): Promise<DetailedPrescription[]> => {
  return prisma.prescription.findMany({
    where: { patientId },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });
};

/**
 * @description Liste les ordonnances emises par un praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param doctorId Identifiant du medecin.
 * @returns Liste ordonnee des ordonnances.
 */
export const findDoctorPrescriptionsList = async (
  doctorId: number
): Promise<DetailedPrescription[]> => {
  return prisma.prescription.findMany({
    where: { doctorId },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });
};
