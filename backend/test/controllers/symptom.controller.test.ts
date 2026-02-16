import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { SymptomController } from "../../src/controllers/symptom.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("SymptomController", () => {
  let symptomController: SymptomController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    symptomController = new SymptomController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllSymptoms", () => {
    test("should return all symptoms with pagination", async () => {
      const mockSymptoms = [
        { id: 1, name: "Fever", description: "High temperature" },
        { id: 2, name: "Headache", description: "Pain in head" },
      ];

      mockPrismaClient.symptom.findMany.mockResolvedValue(mockSymptoms);
      mockPrismaClient.symptom.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await symptomController.getAllSymptoms(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.symptom.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockSymptoms,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getSymptomById", () => {
    test("should return a symptom by ID", async () => {
      const mockSymptom = {
        id: 1,
        name: "Fever",
        description: "High temperature",
      };

      mockPrismaClient.symptom.findUnique.mockResolvedValue(mockSymptom);
      mockRequest.params = { id: "1" };

      await symptomController.getSymptomById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.symptom.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockSymptom,
        })
      );
    });
  });

  describe("createSymptom", () => {
    test("should create a new symptom", async () => {
      const newSymptom = {
        name: "Fever",
        description: "High temperature",
      };

      const createdSymptom = { id: 1, ...newSymptom };

      mockPrismaClient.symptom.create.mockResolvedValue(createdSymptom);
      mockRequest.body = newSymptom;

      await symptomController.createSymptom(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.symptom.create).toHaveBeenCalledWith({
        data: newSymptom,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdSymptom,
        })
      );
    });
  });

  describe("updateSymptom", () => {
    test("should update a symptom", async () => {
      const updatedData = { description: "Updated description" };
      const updatedSymptom = {
        id: 1,
        name: "Fever",
        description: "Updated description",
      };

      mockPrismaClient.symptom.update.mockResolvedValue(updatedSymptom);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await symptomController.updateSymptom(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.symptom.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedSymptom,
        })
      );
    });
  });

  describe("deleteSymptom", () => {
    test("should delete a symptom", async () => {
      const deletedSymptom = {
        id: 1,
        name: "Fever",
        description: "High temperature",
      };

      mockPrismaClient.symptom.delete.mockResolvedValue(deletedSymptom);
      mockRequest.params = { id: "1" };

      await symptomController.deleteSymptom(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.symptom.delete).toHaveBeenCalledWith({
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
