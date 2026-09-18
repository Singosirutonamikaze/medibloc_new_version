/**
 * @file pharmacy.service.ts
 * @description Logique metier et persistance Prisma pour les pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Pharmacy, Medicine } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreatePharmacyDto, UpdatePharmacyDto } from "../dtos/pharmacy.dto";

export const findAllPharmacies = async (): Promise<Pharmacy[]> => {
  return prisma.pharmacy.findMany({
    include: { country: true, medicines: true },
    orderBy: { name: "asc" },
  });
};

export const findPharmacyById = async (id: number): Promise<Pharmacy> => {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id },
    include: { country: true, medicines: true },
  });

  const exists = pharmacy !== null;
  const pharmacyResolvers: Record<string, () => Pharmacy> = {
    true: () => pharmacy as Pharmacy,
    false: () => {
      throw new Error("Pharmacie introuvable");
    },
  };

  return pharmacyResolvers[String(exists)]();
};

export const findPharmaciesByCountry = async (
  countryId: number
): Promise<Pharmacy[]> => {
  return prisma.pharmacy.findMany({
    where: { countryId },
    include: { country: true, medicines: true },
    orderBy: { name: "asc" },
  });
};

export const createPharmacy = async (
  dto: CreatePharmacyDto
): Promise<Pharmacy> => {
  return prisma.pharmacy.create({
    data: {
      name: dto.name,
      address: dto.address,
      city: dto.city,
      countryId: dto.countryId,
      phone: dto.phone || "",
      email: dto.email || "",
    },
  });
};

export const updatePharmacy = async (
  id: number,
  dto: UpdatePharmacyDto
): Promise<Pharmacy> => {
  return prisma.pharmacy.update({
    where: { id },
    data: dto,
  });
};

export const deletePharmacy = async (id: number): Promise<Pharmacy> => {
  return prisma.pharmacy.delete({
    where: { id },
  });
};

export const findPharmacyMedicines = async (
  id: number
): Promise<Medicine[]> => {
  return prisma.medicine.findMany({
    where: { pharmacyId: id },
  });
};
