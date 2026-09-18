import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllPrescriptions,
  findPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../../src/features/prescription/services/prescription.service";

describe("PrescriptionService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllPrescriptions", () => {
    test("should return list of all prescriptions", async () => {
      const mockPrescriptions = [
        { id: 1, patientId: 1, doctorId: 1, appointmentId: 1 },
      ];
      mockPrismaClient.prescription.findMany.mockResolvedValue(mockPrescriptions);

      const result = await findAllPrescriptions();

      expect(mockPrismaClient.prescription.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockPrescriptions);
    });
  });

  describe("findPrescriptionById", () => {
    test("should return prescription when found", async () => {
      const mockPrescription = { id: 1, patientId: 1, doctorId: 1, appointmentId: 1 };
      mockPrismaClient.prescription.findUnique.mockResolvedValue(mockPrescription);

      const result = await findPrescriptionById(1);

      expect(mockPrismaClient.prescription.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockPrescription);
    });

    test("should throw error when prescription not found", async () => {
      mockPrismaClient.prescription.findUnique.mockResolvedValue(null);

      await expect(findPrescriptionById(999)).rejects.toThrow("Ordonnance introuvable");
    });
  });

  describe("createPrescription", () => {
    test("should create and return a prescription", async () => {
      const dto = {
        patientId: 1,
        doctorId: 1,
        medications: "Paracetamol 1g",
        diagnosis: "Fievre",
      };
      const created = { id: 1, ...dto };
      mockPrismaClient.prescription.create.mockResolvedValue(created);

      const result = await createPrescription(dto);

      expect(mockPrismaClient.prescription.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updatePrescription", () => {
    test("should update and return the prescription", async () => {
      const dto = { medications: "Ibuprofene 400mg" };
      const updated = { id: 1, patientId: 1, doctorId: 1, medications: "Ibuprofene 400mg" };
      mockPrismaClient.prescription.update.mockResolvedValue(updated);

      const result = await updatePrescription(1, dto);

      expect(mockPrismaClient.prescription.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });


  describe("deletePrescription", () => {
    test("should delete and return deleted prescription", async () => {
      const deleted = { id: 1 };
      mockPrismaClient.prescription.delete.mockResolvedValue(deleted);

      const result = await deletePrescription(1);

      expect(mockPrismaClient.prescription.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
