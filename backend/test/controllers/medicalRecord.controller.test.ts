import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../../src/features/medical-record/controllers/medical-record.controller";
import type { Request, Response } from "express";
import { createMockRequest, createMockResponse } from "../setup/test-helpers";

describe("MedicalRecordController", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAll", () => {
    test("should return all medical records", async () => {
      const mockRecords = [
        { id: 1, patientId: 1, doctorId: 1, diagnosis: "Paludisme" },
      ];

      mockPrismaClient.medicalRecord.findMany.mockResolvedValue(mockRecords);

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicalRecord.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockRecords,
        }),
      );
    });
  });

  describe("getById", () => {
    test("should return a medical record by ID", async () => {
      const mockRecord = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        diagnosis: "Paludisme",
      };

      mockPrismaClient.medicalRecord.findUnique.mockResolvedValue(mockRecord);
      mockRequest.params = { id: "1" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicalRecord.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockRecord,
        }),
      );
    });

    test("should return 404 when medical record not found", async () => {
      mockPrismaClient.medicalRecord.findUnique.mockResolvedValue(null);
      mockRequest.params = { id: "999" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        }),
      );
    });
  });

  describe("create", () => {
    test("should create a new medical record", async () => {
      const newRecord = {
        patientId: 1,
        doctorId: 1,
        diagnosis: "Paludisme",
      };

      const createdRecord = { id: 1, ...newRecord };

      mockPrismaClient.medicalRecord.create.mockResolvedValue(createdRecord);
      mockRequest.body = newRecord;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicalRecord.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdRecord,
        }),
      );
    });
  });

  describe("update", () => {
    test("should update a medical record", async () => {
      const updatedData = { diagnosis: "Paludisme severe" };
      const updatedRecord = {
        id: 1,
        diagnosis: "Paludisme severe",
      };

      mockPrismaClient.medicalRecord.update.mockResolvedValue(updatedRecord);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicalRecord.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedRecord,
        }),
      );
    });
  });

  describe("remove", () => {
    test("should delete a medical record", async () => {
      const deletedRecord = {
        id: 1,
      };

      mockPrismaClient.medicalRecord.delete.mockResolvedValue(deletedRecord);
      mockRequest.params = { id: "1" };

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicalRecord.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
      );
    });
  });
});
