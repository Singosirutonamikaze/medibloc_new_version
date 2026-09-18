import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllMedicalRecords,
  findMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../../src/features/medical-record/services/medical-record.service";

describe("MedicalRecordService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllMedicalRecords", () => {
    test("should return list of all medical records", async () => {
      const mockRecords = [
        { id: 1, patientId: 1, doctorId: 1, diagnosis: "Paludisme" },
      ];
      mockPrismaClient.medicalRecord.findMany.mockResolvedValue(mockRecords);

      const result = await findAllMedicalRecords();

      expect(mockPrismaClient.medicalRecord.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockRecords);
    });
  });

  describe("findMedicalRecordById", () => {
    test("should return medical record when found", async () => {
      const mockRecord = { id: 1, patientId: 1, doctorId: 1, diagnosis: "Paludisme" };
      mockPrismaClient.medicalRecord.findUnique.mockResolvedValue(mockRecord);

      const result = await findMedicalRecordById(1);

      expect(mockPrismaClient.medicalRecord.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockRecord);
    });

    test("should throw error when record not found", async () => {
      mockPrismaClient.medicalRecord.findUnique.mockResolvedValue(null);

      await expect(findMedicalRecordById(999)).rejects.toThrow("Dossier medical introuvable");
    });
  });

  describe("createMedicalRecord", () => {
    test("should create and return a medical record", async () => {
      const dto = {
        patientId: 1,
        title: "Bilan",
        content: "Observation clinique",
      };
      const created = { id: 1, ...dto };
      mockPrismaClient.medicalRecord.create.mockResolvedValue(created);

      const result = await createMedicalRecord(dto);

      expect(mockPrismaClient.medicalRecord.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updateMedicalRecord", () => {
    test("should update and return the medical record", async () => {
      const dto = { title: "Bilan modifie" };
      const updated = { id: 1, patientId: 1, title: "Bilan modifie", content: "Observation" };
      mockPrismaClient.medicalRecord.update.mockResolvedValue(updated);

      const result = await updateMedicalRecord(1, dto);

      expect(mockPrismaClient.medicalRecord.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });


  describe("deleteMedicalRecord", () => {
    test("should delete and return deleted medical record", async () => {
      const deleted = { id: 1 };
      mockPrismaClient.medicalRecord.delete.mockResolvedValue(deleted);

      const result = await deleteMedicalRecord(1);

      expect(mockPrismaClient.medicalRecord.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
