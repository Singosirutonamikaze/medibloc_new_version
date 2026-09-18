/**
 * @file medicine.service.ts
 * @description Couche de logique metier et persistance Prisma pour le catalogue des medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Medicine } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateMedicineDto, UpdateMedicineDto } from "../dtos/medicine.dto";

/**
 * @description Recupere tous les medicaments repertories.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Promesse de la liste des medicaments.
 */
export const findAllMedicines = async (): Promise<Medicine[]> => {
  return prisma.medicine.findMany({
    include: { pharmacy: true },
    orderBy: { name: "asc" },
  });
};

/**
 * @description Recherche un medicament par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du medicament.
 * @returns Promesse du medicament trouve.
 */
export const findMedicineById = async (id: number): Promise<Medicine> => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: { pharmacy: true },
  });

  const exists = medicine !== null;
  const medicineResolvers: Record<string, () => Medicine> = {
    true: () => medicine as Medicine,
    false: () => {
      throw new Error("Medicament introuvable");
    },
  };

  return medicineResolvers[String(exists)]();
};

/**
 * @description Enregistre un nouveau medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees de creation du medicament.
 * @returns Promesse du medicament cree.
 */
export const createMedicine = async (
  dto: CreateMedicineDto
): Promise<Medicine> => {
  return prisma.medicine.create({
    data: {
      name: dto.name,
      type: dto.type,
      description: dto.description || "",
      composition: dto.composition || "",
      scientificName: dto.scientificName || "",
      commonNames: dto.commonNames || [],
      pharmacyId: dto.pharmacyId,
      sideEffects: dto.sideEffects || [],
      contraindications: dto.contraindications || [],
    },
  });
};

/**
 * @description Met a jour les informations d'un medicament existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du medicament.
 * @param dto Donnees de mise a jour.
 * @returns Promesse du medicament modifie.
 */
export const updateMedicine = async (
  id: number,
  dto: UpdateMedicineDto
): Promise<Medicine> => {
  return prisma.medicine.update({
    where: { id },
    data: dto,
  });
};

/**
 * @description Supprime un medicament de la base de donnees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du medicament a supprimer.
 * @returns Promesse du medicament supprime.
 */
export const deleteMedicine = async (id: number): Promise<Medicine> => {
  return prisma.medicine.delete({
    where: { id },
  });
};
