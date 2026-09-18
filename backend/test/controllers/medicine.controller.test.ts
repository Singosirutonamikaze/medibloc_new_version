import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../../src/features/medicine/controllers/medicine.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("MedicineController", () => {
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
    test("should return all medicines", async () => {
      const mockMedicines = [
        { id: 1, name: "Paracetamol", dosage: "500mg" },
      ];

      mockPrismaClient.medicine.findMany.mockResolvedValue(mockMedicines);

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicine.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockMedicines,
        })
      );
    });
  });

  describe("getById", () => {
    test("should return a medicine by ID", async () => {
      const mockMedicine = {
        id: 1,
        name: "Paracetamol",
        dosage: "500mg",
      };

      mockPrismaClient.medicine.findUnique.mockResolvedValue(mockMedicine);
      mockRequest.params = { id: "1" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicine.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockMedicine,
        })
      );
    });

    test("should return 404 when medicine not found", async () => {
      mockPrismaClient.medicine.findUnique.mockResolvedValue(null);
      mockRequest.params = { id: "999" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });

  describe("create", () => {
    test("should create a new medicine", async () => {
      const newMedicine = {
        name: "Paracetamol",
        dosage: "500mg",
        pharmacyId: 1,
      };

      const createdMedicine = { id: 1, ...newMedicine };

      mockPrismaClient.medicine.create.mockResolvedValue(createdMedicine);
      mockRequest.body = newMedicine;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicine.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdMedicine,
        })
      );
    });
  });

  describe("update", () => {
    test("should update a medicine", async () => {
      const updatedData = { dosage: "1000mg" };
      const updatedMedicine = {
        id: 1,
        name: "Paracetamol",
        dosage: "1000mg",
      };

      mockPrismaClient.medicine.update.mockResolvedValue(updatedMedicine);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicine.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedMedicine,
        })
      );
    });
  });

  describe("remove", () => {
    test("should delete a medicine", async () => {
      const deletedMedicine = {
        id: 1,
      };

      mockPrismaClient.medicine.delete.mockResolvedValue(deletedMedicine);
      mockRequest.params = { id: "1" };

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.medicine.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
