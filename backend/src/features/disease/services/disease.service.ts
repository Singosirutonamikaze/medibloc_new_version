/**
 * @file disease.service.ts
 * @description Couche de logique metier et persistance Prisma pour la gestion des pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Disease, DiseaseSymptom, Country } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateDiseaseDto, UpdateDiseaseDto } from "../dtos/disease.dto";

/**
 * @description Recupere toutes les pathologies repertoriees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Promesse de la liste des maladies.
 */
export const findAllDiseases = async (): Promise<Disease[]> => {
  return prisma.disease.findMany({
    include: {
      symptoms: { include: { symptom: true } },
      prevalentCountries: { include: { country: true } },
    },
    orderBy: { name: "asc" },
  });
};

/**
 * @description Recherche une pathologie par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de la maladie.
 * @returns Promesse de l'entite maladie.
 */
export const findDiseaseById = async (id: number): Promise<Disease> => {
  const disease = await prisma.disease.findUnique({
    where: { id },
    include: {
      symptoms: { include: { symptom: true } },
      prevalentCountries: { include: { country: true } },
    },
  });

  const exists = disease !== null;
  const diseaseResolvers: Record<string, () => Disease> = {
    true: () => disease as Disease,
    false: () => {
      throw new Error("Maladie non trouvee");
    },
  };

  return diseaseResolvers[String(exists)]();
};

/**
 * @description Enregistre une nouvelle pathologie dans la base clinique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees de creation de la maladie.
 * @returns Promesse de l'entite creee.
 */
export const createDisease = async (
  dto: CreateDiseaseDto
): Promise<Disease> => {
  return prisma.disease.create({
    data: {
      name: dto.name,
      description: dto.description || "",
      isViral: dto.isViral || false,
      isBacterial: dto.isBacterial || false,
      isGenetic: dto.isGenetic || false,
      isChronic: dto.isChronic || false,
    },
  });
};

/**
 * @description Met a jour les donnees cliniques d'une pathologie existante.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de la maladie.
 * @param dto Donnees de mise a jour.
 * @returns Promesse de l'entite modifiee.
 */
export const updateDisease = async (
  id: number,
  dto: UpdateDiseaseDto
): Promise<Disease> => {
  return prisma.disease.update({
    where: { id },
    data: dto,
  });
};

/**
 * @description Supprime une pathologie du catalogue medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de la maladie a supprimer.
 * @returns Promesse de l'entite supprimee.
 */
export const deleteDisease = async (id: number): Promise<Disease> => {
  return prisma.disease.delete({
    where: { id },
  });
};

/**
 * @description Recupere la liste des symptomes associes a une pathologie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de la maladie.
 * @returns Promesse de la liste des symptomes relies.
 */
export const findDiseaseSymptoms = async (
  id: number
): Promise<DiseaseSymptom[]> => {
  return prisma.diseaseSymptom.findMany({
    where: { diseaseId: id },
    include: { symptom: true },
  });
};

/**
 * @description Recupere la liste des pays ou la maladie est presente.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de la maladie.
 * @returns Promesse de la liste des pays.
 */
export const findDiseaseCountries = async (
  id: number
): Promise<Country[]> => {
  const relations = await prisma.diseaseCountry.findMany({
    where: { diseaseId: id },
    include: { country: true },
  });

  return relations.map((rel) => rel.country);
};

/**
 * @description Associe un symptome a une maladie donnee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param diseaseId Identifiant de la maladie.
 * @param symptomId Identifiant du symptome a connecter.
 * @returns Promesse de l'association creee.
 */
export const addSymptomToDisease = async (
  diseaseId: number,
  symptomId: number
): Promise<DiseaseSymptom> => {
  return prisma.diseaseSymptom.upsert({
    where: {
      diseaseId_symptomId: { diseaseId, symptomId },
    },
    update: {},
    create: {
      diseaseId,
      symptomId,
    },
  });
};

/**
 * @description Dissocie un symptome d'une maladie donnee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param diseaseId Identifiant de la maladie.
 * @param symptomId Identifiant du symptome a deconnecter.
 * @returns Promesse de l'association supprimee.
 */
export const removeSymptomFromDisease = async (
  diseaseId: number,
  symptomId: number
): Promise<DiseaseSymptom> => {
  return prisma.diseaseSymptom.delete({
    where: {
      diseaseId_symptomId: { diseaseId, symptomId },
    },
  });
};
