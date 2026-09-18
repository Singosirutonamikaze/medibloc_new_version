import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllSymptoms,
  findSymptomById,
  createSymptom,
  updateSymptom,
  deleteSymptom,
} from "../../src/features/symptom/services/symptom.service";

describe("SymptomService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllSymptoms", () => {
    test("should return list of all symptoms", async () => {
      const mockSymptoms = [
        { id: 1, name: "Fievre", description: "Elevation de temperature" },
      ];
      mockPrismaClient.symptom.findMany.mockResolvedValue(mockSymptoms);

      const result = await findAllSymptoms();

      expect(mockPrismaClient.symptom.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockSymptoms);
    });
  });

  describe("findSymptomById", () => {
    test("should return symptom when found", async () => {
      const mockSymptom = { id: 1, name: "Fievre" };
      mockPrismaClient.symptom.findUnique.mockResolvedValue(mockSymptom);

      const result = await findSymptomById(1);

      expect(mockPrismaClient.symptom.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockSymptom);
    });

    test("should throw error when symptom not found", async () => {
      mockPrismaClient.symptom.findUnique.mockResolvedValue(null);

      await expect(findSymptomById(999)).rejects.toThrow("Symptome introuvable");
    });
  });

  describe("createSymptom", () => {
    test("should create and return a symptom", async () => {
      const dto = { name: "Cephalees", description: "Maux de tete" };
      const created = { id: 2, ...dto };
      mockPrismaClient.symptom.create.mockResolvedValue(created);

      const result = await createSymptom(dto);

      expect(mockPrismaClient.symptom.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updateSymptom", () => {
    test("should update and return the symptom", async () => {
      const dto = { description: "Maux de tete intenses" };
      const updated = { id: 1, name: "Cephalees", ...dto };
      mockPrismaClient.symptom.update.mockResolvedValue(updated);

      const result = await updateSymptom(1, dto);

      expect(mockPrismaClient.symptom.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });

  describe("deleteSymptom", () => {
    test("should delete and return deleted symptom", async () => {
      const deleted = { id: 1, name: "Fievre" };
      mockPrismaClient.symptom.delete.mockResolvedValue(deleted);

      const result = await deleteSymptom(1);

      expect(mockPrismaClient.symptom.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
