import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllDiseases,
  findDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
} from "../../src/features/disease/services/disease.service";

describe("DiseaseService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllDiseases", () => {
    test("should return list of all diseases", async () => {
      const mockDiseases = [
        { id: 1, name: "Paludisme", description: "Maladie parasitaire" },
      ];
      mockPrismaClient.disease.findMany.mockResolvedValue(mockDiseases);

      const result = await findAllDiseases();

      expect(mockPrismaClient.disease.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockDiseases);
    });
  });

  describe("findDiseaseById", () => {
    test("should return disease when found", async () => {
      const mockDisease = { id: 1, name: "Paludisme", description: "Maladie parasitaire" };
      mockPrismaClient.disease.findUnique.mockResolvedValue(mockDisease);

      const result = await findDiseaseById(1);

      expect(mockPrismaClient.disease.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockDisease);
    });

    test("should throw error when disease not found", async () => {
      mockPrismaClient.disease.findUnique.mockResolvedValue(null);

      await expect(findDiseaseById(999)).rejects.toThrow("Maladie non trouvee");
    });
  });

  describe("createDisease", () => {
    test("should persist and return a new disease", async () => {
      const dto = { name: "Cholera", description: "Infection bacterienne" };
      const created = { id: 2, ...dto };
      mockPrismaClient.disease.create.mockResolvedValue(created);

      const result = await createDisease(dto);

      expect(mockPrismaClient.disease.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updateDisease", () => {
    test("should update and return the disease", async () => {
      const dto = { description: "Description modifiee" };
      const updated = { id: 1, name: "Paludisme", description: "Description modifiee" };
      mockPrismaClient.disease.update.mockResolvedValue(updated);

      const result = await updateDisease(1, dto);

      expect(mockPrismaClient.disease.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });

  describe("deleteDisease", () => {
    test("should delete and return deleted disease", async () => {
      const deleted = { id: 1, name: "Paludisme" };
      mockPrismaClient.disease.delete.mockResolvedValue(deleted);

      const result = await deleteDisease(1);

      expect(mockPrismaClient.disease.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
