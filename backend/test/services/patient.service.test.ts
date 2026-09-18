import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllPatients,
  findPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../../src/features/patient/services/patient.service";

describe("PatientService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllPatients", () => {
    test("should return list of all patients", async () => {
      const mockPatients = [
        { id: 1, userId: 1, user: { firstName: "Koffi", lastName: "Komla" } },
      ];
      mockPrismaClient.patient.findMany.mockResolvedValue(mockPatients);

      const result = await findAllPatients();

      expect(mockPrismaClient.patient.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockPatients);
    });
  });

  describe("findPatientById", () => {
    test("should return patient when found", async () => {
      const mockPatient = { id: 1, userId: 1, user: { firstName: "Koffi" } };
      mockPrismaClient.patient.findUnique.mockResolvedValue(mockPatient);

      const result = await findPatientById(1);

      expect(mockPrismaClient.patient.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockPatient);
    });

    test("should throw error when patient not found", async () => {
      mockPrismaClient.patient.findUnique.mockResolvedValue(null);

      await expect(findPatientById(999)).rejects.toThrow("Patient introuvable");
    });
  });

  describe("createPatient", () => {
    test("should create and return a patient", async () => {
      const dto = { userId: 1, phone: "+22890000000" };
      const created = { id: 1, ...dto };
      mockPrismaClient.patient.create.mockResolvedValue(created);

      const result = await createPatient(dto);

      expect(mockPrismaClient.patient.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updatePatient", () => {
    test("should update and return the patient", async () => {
      const dto = { phone: "+22899999999" };
      const updated = { id: 1, userId: 1, phone: "+22899999999" };
      mockPrismaClient.patient.update.mockResolvedValue(updated);

      const result = await updatePatient(1, dto);

      expect(mockPrismaClient.patient.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });

  describe("deletePatient", () => {
    test("should delete and return deleted patient", async () => {
      const deleted = { id: 1, userId: 1 };
      mockPrismaClient.patient.delete.mockResolvedValue(deleted);

      const result = await deletePatient(1);

      expect(mockPrismaClient.patient.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
