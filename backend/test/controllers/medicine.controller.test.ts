import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { MedicineController } from "../../src/controllers/medicine.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("MedicineController", () => {
  let medicineController: MedicineController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    medicineController = new MedicineController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllMedicines", () => {
    test("should return all medicines with pagination", async () => {
      const mockMedicines = [
        { id: 1, name: "Paracetamol", type: "Tablet", price: 5.0 },
        { id: 2, name: "Amoxicillin", type: "Capsule", price: 10.0 },
      ];

      mockPrismaClient.medicine.findMany.mockResolvedValue(mockMedicines);
      mockPrismaClient.medicine.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await medicineController.getAllMedicines(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicine.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockMedicines,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getMedicineById", () => {
    test("should return a medicine by ID", async () => {
      const mockMedicine = {
        id: 1,
        name: "Paracetamol",
        type: "Tablet",
        price: 5.0,
      };

      mockPrismaClient.medicine.findUnique.mockResolvedValue(mockMedicine);
      mockRequest.params = { id: "1" };

      await medicineController.getMedicineById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicine.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
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

      await medicineController.getMedicineById(
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

  describe("createMedicine", () => {
    test("should create a new medicine", async () => {
      const newMedicine = {
        name: "Paracetamol",
        type: "Tablet",
        price: 5.0,
      };

      const createdMedicine = { id: 1, ...newMedicine };

      mockPrismaClient.medicine.create.mockResolvedValue(createdMedicine);
      mockRequest.body = newMedicine;

      await medicineController.createMedicine(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicine.create).toHaveBeenCalledWith({
        data: newMedicine,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdMedicine,
        })
      );
    });
  });

  describe("updateMedicine", () => {
    test("should update a medicine", async () => {
      const updatedData = { price: 7.5 };
      const updatedMedicine = {
        id: 1,
        name: "Paracetamol",
        type: "Tablet",
        price: 7.5,
      };

      mockPrismaClient.medicine.update.mockResolvedValue(updatedMedicine);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await medicineController.updateMedicine(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicine.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedMedicine,
        })
      );
    });
  });

  describe("deleteMedicine", () => {
    test("should delete a medicine", async () => {
      const deletedMedicine = {
        id: 1,
        name: "Paracetamol",
        type: "Tablet",
        price: 5.0,
      };

      mockPrismaClient.medicine.delete.mockResolvedValue(deletedMedicine);
      mockRequest.params = { id: "1" };

      await medicineController.deleteMedicine(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.medicine.delete).toHaveBeenCalledWith({
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
