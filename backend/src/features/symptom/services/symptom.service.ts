/**
 * @file symptom.service.ts
 * @description Couche de logique metier et acces a la base de donnees pour les symptomes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Symptom, Disease } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateSymptomDto, UpdateSymptomDto } from "../dtos/symptom.dto";

/**
 * @description Recupere l'ensemble des symptomes repertories.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Promesse de la liste des symptomes.
 */
export const findAllSymptoms = async (): Promise<Symptom[]> => {
  return prisma.symptom.findMany({
    orderBy: { name: "asc" },
  });
};

/**
 * @description Recherche un symptome par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du symptome.
 * @returns Promesse du symptome trouve.
 */
export const findSymptomById = async (id: number): Promise<Symptom> => {
  const symptom = await prisma.symptom.findUnique({
    where: { id },
  });

  const exists = symptom !== null;
  const symptomResolvers: Record<string, () => Symptom> = {
    true: () => symptom as Symptom,
    false: () => {
      throw new Error("Symptome introuvable");
    },
  };

  return symptomResolvers[String(exists)]();
};

/**
 * @description Recupere les maladies associees a un symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du symptome.
 * @returns Promesse des maladies liees.
 */
export const findSymptomDiseases = async (id: number): Promise<Disease[]> => {
  const relations = await prisma.diseaseSymptom.findMany({
    where: { symptomId: id },
    include: { disease: true },
  });
  return relations.map((rel) => (rel as unknown as { disease: Disease }).disease);
};

/**
 * @description Cree un nouveau symptome clinique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees de creation du symptome.
 * @returns Promesse du symptome cree.
 */
export const createSymptom = async (
  dto: CreateSymptomDto
): Promise<Symptom> => {
  return prisma.symptom.create({
    data: {
      name: dto.name,
      description: dto.description || "",
    },
  });
};

/**
 * @description Met a jour un symptome existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du symptome.
 * @param dto Donnees de mise a jour.
 * @returns Promesse du symptome modifie.
 */
export const updateSymptom = async (
  id: number,
  dto: UpdateSymptomDto
): Promise<Symptom> => {
  return prisma.symptom.update({
    where: { id },
    data: dto,
  });
};

/**
 * @description Supprime un symptome de la nomenclature.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du symptome.
 * @returns Promesse du symptome supprime.
 */
export const deleteSymptom = async (id: number): Promise<Symptom> => {
  return prisma.symptom.delete({
    where: { id },
  });
};
