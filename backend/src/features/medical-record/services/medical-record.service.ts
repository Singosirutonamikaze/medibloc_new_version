/**
 * @file medical-record.service.ts
 * @description Logique metier pure et requetes Prisma pour les dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { MedicalRecord } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from "../dtos/medical-record.dto";
import { DetailedMedicalRecord } from "../interfaces/medical-record.interface";

/**
 * @description Recupere l'ensemble des dossiers medicaux avec les coordonnees des patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Collection de {@link DetailedMedicalRecord}.
 */
export const findAllMedicalRecords = async (): Promise<DetailedMedicalRecord[]> => {
  return prisma.medicalRecord.findMany({
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * @description Recherche une entree medicale par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du dossier.
 * @returns Entree detaillee {@link DetailedMedicalRecord}.
 * @throws Error Lorsque l'entree est introuvable.
 */
export const findMedicalRecordById = async (id: number): Promise<DetailedMedicalRecord> => {
  const record = await prisma.medicalRecord.findUnique({
    where: { id },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
  });

  const actionMap: Record<string, () => DetailedMedicalRecord> = {
    true: () => record as DetailedMedicalRecord,
    false: () => {
      throw new Error("Dossier medical introuvable");
    },
  };

  return actionMap[String(Boolean(record))]();
};

/**
 * @description Cree un nouveau dossier medical pour un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees conformes a {@link CreateMedicalRecordDto}.
 * @returns Dossier medical persiste.
 */
export const createMedicalRecord = async (
  dto: CreateMedicalRecordDto
): Promise<MedicalRecord> => {
  return prisma.medicalRecord.create({
    data: {
      patientId: dto.patientId,
      title: dto.title,
      content: dto.content,
      files: dto.files || [],
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * @description Met a jour une entree de dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du dossier.
 * @param dto Donnees a modifier {@link UpdateMedicalRecordDto}.
 * @returns Dossier mis a jour.
 */
export const updateMedicalRecord = async (
  id: number,
  dto: UpdateMedicalRecordDto
): Promise<MedicalRecord> => {
  return prisma.medicalRecord.update({
    where: { id },
    data: {
      ...(dto.title ? { title: dto.title } : {}),
      ...(dto.content ? { content: dto.content } : {}),
      ...(dto.files ? { files: dto.files } : {}),
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * @description Supprime une observation de dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de l'enregistrement.
 * @returns Enregistrement supprime.
 */
export const deleteMedicalRecord = async (id: number): Promise<MedicalRecord> => {
  return prisma.medicalRecord.delete({
    where: { id },
  });
};

/**
 * @description Liste les observations cliniques associees a un patient specifique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param patientId Identifiant du patient.
 * @returns Liste ordonnee des dossiers.
 */
export const findPatientMedicalRecordsList = async (
  patientId: number
): Promise<DetailedMedicalRecord[]> => {
  return prisma.medicalRecord.findMany({
    where: { patientId },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
