import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllPharmacies,
  findPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
} from "../../src/features/pharmacy/services/pharmacy.service";

describe("PharmacyService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllPharmacies", () => {
    test("should return list of all pharmacies", async () => {
      const mockPharmacies = [
        { id: 1, name: "Pharmacie Centrale", address: "Lomé" },
      ];
      mockPrismaClient.pharmacy.findMany.mockResolvedValue(mockPharmacies);

      const result = await findAllPharmacies();

      expect(mockPrismaClient.pharmacy.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockPharmacies);
    });
  });

  describe("findPharmacyById", () => {
    test("should return pharmacy when found", async () => {
      const mockPharmacy = { id: 1, name: "Pharmacie Centrale" };
      mockPrismaClient.pharmacy.findUnique.mockResolvedValue(mockPharmacy);

      const result = await findPharmacyById(1);

      expect(mockPrismaClient.pharmacy.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockPharmacy);
    });

    test("should throw error when pharmacy not found", async () => {
      mockPrismaClient.pharmacy.findUnique.mockResolvedValue(null);

      await expect(findPharmacyById(999)).rejects.toThrow("Pharmacie introuvable");
    });
  });

  describe("createPharmacy", () => {
    test("should create and return a pharmacy", async () => {
      const dto = { name: "Pharmacie Nouvelle", address: "Boulevard 1", city: "Lomé", countryId: 1 };
      const created = { id: 1, ...dto };
      mockPrismaClient.pharmacy.create.mockResolvedValue(created);

      const result = await createPharmacy(dto);

      expect(mockPrismaClient.pharmacy.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updatePharmacy", () => {
    test("should update and return the pharmacy", async () => {
      const dto = { name: "Pharmacie Modifiee" };
      const updated = { id: 1, name: "Pharmacie Modifiee", address: "Lomé", city: "Lomé", countryId: 1 };
      mockPrismaClient.pharmacy.update.mockResolvedValue(updated);

      const result = await updatePharmacy(1, dto);

      expect(mockPrismaClient.pharmacy.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });

  describe("deletePharmacy", () => {
    test("should delete and return deleted pharmacy", async () => {
      const deleted = { id: 1, name: "Pharmacie Centrale" };
      mockPrismaClient.pharmacy.delete.mockResolvedValue(deleted);

      const result = await deletePharmacy(1);

      expect(mockPrismaClient.pharmacy.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
