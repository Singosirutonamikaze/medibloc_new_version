import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { PrescriptionController } from "../../src/controllers/prescription.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("PrescriptionController", () => {
  let prescriptionController: PrescriptionController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    prescriptionController = new PrescriptionController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllPrescriptions", () => {
    test("should return all prescriptions with pagination", async () => {
      const mockPrescriptions = [
        { id: 1, patientId: 1, doctorId: 1, medicineId: 1, dosage: "2 tablets daily" },
        { id: 2, patientId: 2, doctorId: 1, medicineId: 2, dosage: "1 capsule twice daily" },
      ];

      mockPrismaClient.prescription.findMany.mockResolvedValue(mockPrescriptions);
      mockPrismaClient.prescription.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await prescriptionController.getAllPrescriptions(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.prescription.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockPrescriptions,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getPrescriptionById", () => {
    test("should return a prescription by ID", async () => {
      const mockPrescription = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        medicineId: 1,
        dosage: "2 tablets daily",
      };

      mockPrismaClient.prescription.findUnique.mockResolvedValue(mockPrescription);
      mockRequest.params = { id: "1" };

      await prescriptionController.getPrescriptionById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.prescription.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPrescription,
        })
      );
    });

    test("should return 404 when prescription not found", async () => {
      mockPrismaClient.prescription.findUnique.mockResolvedValue(null);
      mockRequest.params = { id: "999" };

      await prescriptionController.getPrescriptionById(
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

  describe("createPrescription", () => {
    test("should create a new prescription", async () => {
      const newPrescription = {
        patientId: 1,
        doctorId: 1,
        medicineId: 1,
        dosage: "2 tablets daily",
      };

      const createdPrescription = { id: 1, ...newPrescription };

      mockPrismaClient.prescription.create.mockResolvedValue(createdPrescription);
      mockRequest.body = newPrescription;

      await prescriptionController.createPrescription(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.prescription.create).toHaveBeenCalledWith({
        data: newPrescription,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdPrescription,
        })
      );
    });
  });

  describe("updatePrescription", () => {
    test("should update a prescription", async () => {
      const updatedData = { dosage: "3 tablets daily" };
      const updatedPrescription = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        medicineId: 1,
        dosage: "3 tablets daily",
      };

      mockPrismaClient.prescription.update.mockResolvedValue(updatedPrescription);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await prescriptionController.updatePrescription(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.prescription.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedPrescription,
        })
      );
    });
  });

  describe("deletePrescription", () => {
    test("should delete a prescription", async () => {
      const deletedPrescription = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        medicineId: 1,
        dosage: "2 tablets daily",
      };

      mockPrismaClient.prescription.delete.mockResolvedValue(deletedPrescription);
      mockRequest.params = { id: "1" };

      await prescriptionController.deletePrescription(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.prescription.delete).toHaveBeenCalledWith({
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
