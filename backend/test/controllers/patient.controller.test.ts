import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../../src/features/patient/controllers/patient.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("PatientController", () => {
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
    test("should return all patients", async () => {
      const mockPatients = [
        { id: 1, userId: 1, user: { firstName: "Koffi", lastName: "Komla", email: "koffi@example.com" } },
      ];

      mockPrismaClient.patient.findMany.mockResolvedValue(mockPatients);

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.patient.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPatients,
        })
      );
    });
  });

  describe("getById", () => {
    test("should return a patient by ID", async () => {
      const mockPatient = {
        id: 1,
        userId: 1,
        user: { firstName: "Koffi", lastName: "Komla", email: "koffi@example.com" },
      };

      mockPrismaClient.patient.findUnique.mockResolvedValue(mockPatient);
      mockRequest.params = { id: "1" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.patient.findUnique).toHaveBeenCalled();
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
    test("should create a new patient", async () => {
      const newPatient = {
        userId: 1,
        phone: "+22890000000",
      };

      const createdPatient = { id: 1, ...newPatient };

      mockPrismaClient.patient.create.mockResolvedValue(createdPatient);
      mockRequest.body = newPatient;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.patient.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdPatient,
        })
      );
    });
  });

  describe("update", () => {
    test("should update a patient", async () => {
      const updatedData = { phone: "+22899999999" };
      const updatedPatient = {
        id: 1,
        phone: "+22899999999",
      };

      mockPrismaClient.patient.update.mockResolvedValue(updatedPatient);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.patient.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedPatient,
        })
      );
    });
  });

  describe("remove", () => {
    test("should delete a patient", async () => {
      const deletedPatient = {
        id: 1,
      };

      mockPrismaClient.patient.delete.mockResolvedValue(deletedPatient);
      mockRequest.params = { id: "1" };

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.patient.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
