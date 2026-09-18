import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllMedicines,
  findMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../src/features/medicine/services/medicine.service";

describe("MedicineService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllMedicines", () => {
    test("should return list of medicines", async () => {
      const mockMedicines = [
        { id: 1, name: "Paracetamol", dosage: "500mg" },
      ];
      mockPrismaClient.medicine.findMany.mockResolvedValue(mockMedicines);

      const result = await findAllMedicines();

      expect(mockPrismaClient.medicine.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockMedicines);
    });
  });

  describe("findMedicineById", () => {
    test("should return medicine by ID", async () => {
      const mockMedicine = { id: 1, name: "Paracetamol" };
      mockPrismaClient.medicine.findUnique.mockResolvedValue(mockMedicine);

      const result = await findMedicineById(1);

      expect(mockPrismaClient.medicine.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockMedicine);
    });

    test("should throw error when medicine not found", async () => {
      mockPrismaClient.medicine.findUnique.mockResolvedValue(null);

      await expect(findMedicineById(999)).rejects.toThrow("Medicament introuvable");
    });
  });

  describe("createMedicine", () => {
    test("should create and return a medicine", async () => {
      const dto = {
        name: "Ibuprofene",
        type: "MODERN" as const,
        pharmacyId: 1,
      };
      const created = { id: 2, ...dto };
      mockPrismaClient.medicine.create.mockResolvedValue(created);

      const result = await createMedicine(dto);

      expect(mockPrismaClient.medicine.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updateMedicine", () => {
    test("should update and return the medicine", async () => {
      const dto = { name: "Paracetamol 1g" };
      const updated = { id: 1, name: "Paracetamol 1g", type: "MODERN" };
      mockPrismaClient.medicine.update.mockResolvedValue(updated);

      const result = await updateMedicine(1, dto);

      expect(mockPrismaClient.medicine.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });


  describe("deleteMedicine", () => {
    test("should delete and return deleted medicine", async () => {
      const deleted = { id: 1, name: "Paracetamol" };
      mockPrismaClient.medicine.delete.mockResolvedValue(deleted);

      const result = await deleteMedicine(1);

      expect(mockPrismaClient.medicine.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
