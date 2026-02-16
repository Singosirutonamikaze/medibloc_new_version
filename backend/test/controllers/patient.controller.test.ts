import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { PatientController } from "../../src/controllers/patient.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("PatientController", () => {
  let patientController: PatientController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    patientController = new PatientController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllPatients", () => {
    test("should return all patients with pagination", async () => {
      const mockPatients = [
        { id: 1, firstName: "Koffi", lastName: "Komla", email: "koffi@example.com" },
        { id: 2, firstName: "Ama", lastName: "Ayawa", email: "ama@example.com" },
      ];

      mockPrismaClient.patient.findMany.mockResolvedValue(mockPatients);
      mockPrismaClient.patient.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await patientController.getAllPatients(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.patient.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockPatients,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });

    test("should handle errors gracefully", async () => {
      mockPrismaClient.patient.findMany.mockRejectedValue(
        new Error("Database error")
      );

      mockRequest.query = { page: "1", limit: "10" };

      await patientController.getAllPatients(
        mockRequest as Request,
        mockResponse
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });

  describe("getPatientById", () => {
    test("should return a patient by ID", async () => {
      const mockPatient = {
        id: 1,
        firstName: "Koffi",
        lastName: "Komla",
        email: "koffi@example.com",
      };

      mockPrismaClient.patient.findUnique.mockResolvedValue(mockPatient);
      mockRequest.params = { id: "1" };

      await patientController.getPatientById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.patient.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPatient,
        })
      );
    });

    test("should return 404 when patient not found", async () => {
      mockPrismaClient.patient.findUnique.mockResolvedValue(null);
      mockRequest.params = { id: "999" };

      await patientController.getPatientById(
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

  describe("createPatient", () => {
    test("should create a new patient", async () => {
      const newPatient = {
        firstName: "Koffi",
        lastName: "Komla",
        email: "koffi@example.com",
        password: "hashedPassword123",
      };

      const createdPatient = { id: 1, ...newPatient };

      mockPrismaClient.patient.create.mockResolvedValue(createdPatient);
      mockRequest.body = newPatient;

      await patientController.createPatient(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.patient.create).toHaveBeenCalledWith({
        data: newPatient,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdPatient,
        })
      );
    });
  });

  describe("updatePatient", () => {
    test("should update a patient", async () => {
      const updatedData = { firstName: "Updated Name" };
      const updatedPatient = {
        id: 1,
        firstName: "Updated Name",
        lastName: "Komla",
        email: "koffi@example.com",
      };

      mockPrismaClient.patient.update.mockResolvedValue(updatedPatient);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await patientController.updatePatient(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.patient.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedPatient,
        })
      );
    });
  });

  describe("deletePatient", () => {
    test("should delete a patient", async () => {
      const deletedPatient = {
        id: 1,
        firstName: "Koffi",
        lastName: "Komla",
        email: "koffi@example.com",
      };

      mockPrismaClient.patient.delete.mockResolvedValue(deletedPatient);
      mockRequest.params = { id: "1" };

      await patientController.deletePatient(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.patient.delete).toHaveBeenCalledWith({
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
