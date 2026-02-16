import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { DiseaseController } from "../../src/controllers/disease.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("DiseaseController", () => {
  let diseaseController: DiseaseController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    diseaseController = new DiseaseController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllDiseases", () => {
    test("should return all diseases with pagination", async () => {
      const mockDiseases = [
        { id: 1, name: "Malaria", description: "Parasitic disease" },
        { id: 2, name: "Typhoid", description: "Bacterial infection" },
      ];

      mockPrismaClient.disease.findMany.mockResolvedValue(mockDiseases);
      mockPrismaClient.disease.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await diseaseController.getAllDiseases(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.disease.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockDiseases,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getDiseaseById", () => {
    test("should return a disease by ID", async () => {
      const mockDisease = {
        id: 1,
        name: "Malaria",
        description: "Parasitic disease",
      };

      mockPrismaClient.disease.findUnique.mockResolvedValue(mockDisease);
      mockRequest.params = { id: "1" };

      await diseaseController.getDiseaseById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.disease.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockDisease,
        })
      );
    });

    test("should return 404 when disease not found", async () => {
      mockPrismaClient.disease.findUnique.mockResolvedValue(null);
      mockRequest.params = { id: "999" };

      await diseaseController.getDiseaseById(
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

  describe("createDisease", () => {
    test("should create a new disease", async () => {
      const newDisease = {
        name: "Malaria",
        description: "Parasitic disease",
      };

      const createdDisease = { id: 1, ...newDisease };

      mockPrismaClient.disease.create.mockResolvedValue(createdDisease);
      mockRequest.body = newDisease;

      await diseaseController.createDisease(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.disease.create).toHaveBeenCalledWith({
        data: newDisease,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdDisease,
        })
      );
    });
  });

  describe("updateDisease", () => {
    test("should update a disease", async () => {
      const updatedData = { description: "Updated description" };
      const updatedDisease = {
        id: 1,
        name: "Malaria",
        description: "Updated description",
      };

      mockPrismaClient.disease.update.mockResolvedValue(updatedDisease);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await diseaseController.updateDisease(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.disease.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedDisease,
        })
      );
    });
  });

  describe("deleteDisease", () => {
    test("should delete a disease", async () => {
      const deletedDisease = {
        id: 1,
        name: "Malaria",
        description: "Parasitic disease",
      };

      mockPrismaClient.disease.delete.mockResolvedValue(deletedDisease);
      mockRequest.params = { id: "1" };

      await diseaseController.deleteDisease(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.disease.delete).toHaveBeenCalledWith({
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
