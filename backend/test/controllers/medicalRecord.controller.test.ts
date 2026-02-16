import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { MedicalRecordController } from "../../src/controllers/medicalRecord.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("MedicalRecordController", () => {
  let medicalRecordController: MedicalRecordController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    medicalRecordController = new MedicalRecordController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllMedicalRecords", () => {
    test("should return all medical records with pagination", async () => {
      const mockMedicalRecords = [
        { id: 1, patientId: 1, doctorId: 1, diagnosis: "Malaria", treatment: "Anti-malarial drugs" },
        { id: 2, patientId: 2, doctorId: 1, diagnosis: "Typhoid", treatment: "Antibiotics" },
      ];

      mockPrismaClient.medicalRecord.findMany.mockResolvedValue(mockMedicalRecords);
      mockPrismaClient.medicalRecord.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await medicalRecordController.getAllMedicalRecords(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicalRecord.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockMedicalRecords,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getMedicalRecordById", () => {
    test("should return a medical record by ID", async () => {
      const mockMedicalRecord = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        diagnosis: "Malaria",
        treatment: "Anti-malarial drugs",
      };

      mockPrismaClient.medicalRecord.findUnique.mockResolvedValue(mockMedicalRecord);
      mockRequest.params = { id: "1" };

      await medicalRecordController.getMedicalRecordById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicalRecord.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockMedicalRecord,
        })
      );
    });

    test("should return 404 when medical record not found", async () => {
      mockPrismaClient.medicalRecord.findUnique.mockResolvedValue(null);
      mockRequest.params = { id: "999" };

      await medicalRecordController.getMedicalRecordById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });

  describe("createMedicalRecord", () => {
    test("should create a new medical record", async () => {
      const newMedicalRecord = {
        patientId: 1,
        doctorId: 1,
        diagnosis: "Malaria",
        treatment: "Anti-malarial drugs",
      };

      const createdMedicalRecord = { id: 1, ...newMedicalRecord };

      mockPrismaClient.medicalRecord.create.mockResolvedValue(createdMedicalRecord);
      mockRequest.body = newMedicalRecord;

      await medicalRecordController.createMedicalRecord(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicalRecord.create).toHaveBeenCalledWith({
        data: newMedicalRecord,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdMedicalRecord,
        })
      );
    });
  });

  describe("updateMedicalRecord", () => {
    test("should update a medical record", async () => {
      const updatedData = { treatment: "Updated treatment plan" };
      const updatedMedicalRecord = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        diagnosis: "Malaria",
        treatment: "Updated treatment plan",
      };

      mockPrismaClient.medicalRecord.update.mockResolvedValue(updatedMedicalRecord);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await medicalRecordController.updateMedicalRecord(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicalRecord.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedMedicalRecord,
        })
      );
    });
  });

  describe("deleteMedicalRecord", () => {
    test("should delete a medical record", async () => {
      const deletedMedicalRecord = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        diagnosis: "Malaria",
        treatment: "Anti-malarial drugs",
      };

      mockPrismaClient.medicalRecord.delete.mockResolvedValue(deletedMedicalRecord);
      mockRequest.params = { id: "1" };

      await medicalRecordController.deleteMedicalRecord(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicalRecord.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Supprimé",
        })
      );
    });
  });
});
