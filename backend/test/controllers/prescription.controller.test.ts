import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../../src/features/prescription/controllers/prescription.controller";
import type { Request, Response } from "express";
import { createMockRequest, createMockResponse } from "../setup/test-helpers";

describe("PrescriptionController", () => {
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
    test("should return all prescriptions", async () => {
      const mockPrescriptions = [
        { id: 1, patientId: 1, doctorId: 1, appointmentId: 1 },
      ];

      mockPrismaClient.prescription.findMany.mockResolvedValue(
        mockPrescriptions,
      );

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.prescription.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPrescriptions,
        }),
      );
    });
  });

  describe("getById", () => {
    test("should return a prescription by ID", async () => {
      const mockPrescription = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        appointmentId: 1,
      };

      mockPrismaClient.prescription.findUnique.mockResolvedValue(
        mockPrescription,
      );
      mockRequest.params = { id: "1" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.prescription.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPrescription,
        }),
      );
    });

    test("should return 404 when prescription not found", async () => {
      mockPrismaClient.prescription.findUnique.mockResolvedValue(null);
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
    test("should create a new prescription", async () => {
      const newPrescription = {
        patientId: 1,
        doctorId: 1,
        appointmentId: 1,
        dosageInstructions: "Prendre 1 comprime matin et soir",
      };

      const createdPrescription = { id: 1, ...newPrescription };

      mockPrismaClient.prescription.create.mockResolvedValue(
        createdPrescription,
      );
      mockRequest.body = newPrescription;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.prescription.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdPrescription,
        }),
      );
    });
  });

  describe("update", () => {
    test("should update a prescription", async () => {
      const updatedData = { dosageInstructions: "Nouvelle posologie" };
      const updatedPrescription = {
        id: 1,
        dosageInstructions: "Nouvelle posologie",
      };

      mockPrismaClient.prescription.update.mockResolvedValue(
        updatedPrescription,
      );
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.prescription.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedPrescription,
        }),
      );
    });
  });

  describe("remove", () => {
    test("should delete a prescription", async () => {
      const deletedPrescription = {
        id: 1,
      };

      mockPrismaClient.prescription.delete.mockResolvedValue(
        deletedPrescription,
      );
      mockRequest.params = { id: "1" };

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.prescription.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
      );
    });
  });
});
