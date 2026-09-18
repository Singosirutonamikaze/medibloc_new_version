import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../../src/features/symptom/controllers/symptom.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("SymptomController", () => {
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
    test("should return all symptoms", async () => {
      const mockSymptoms = [
        { id: 1, name: "Fever", description: "High temperature" },
        { id: 2, name: "Headache", description: "Pain in head" },
      ];

      mockPrismaClient.symptom.findMany.mockResolvedValue(mockSymptoms);

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.symptom.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockSymptoms,
        })
      );
    });
  });

  describe("getById", () => {
    test("should return a symptom by ID", async () => {
      const mockSymptom = {
        id: 1,
        name: "Fever",
        description: "High temperature",
      };

      mockPrismaClient.symptom.findUnique.mockResolvedValue(mockSymptom);
      mockRequest.params = { id: "1" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.symptom.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockSymptom,
        })
      );
    });
  });

  describe("create", () => {
    test("should create a new symptom", async () => {
      const newSymptom = {
        name: "Fever",
        description: "High temperature",
      };

      const createdSymptom = { id: 1, ...newSymptom };

      mockPrismaClient.symptom.create.mockResolvedValue(createdSymptom);
      mockRequest.body = newSymptom;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.symptom.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdSymptom,
        })
      );
    });
  });

  describe("update", () => {
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

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.symptom.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedSymptom,
        })
      );
    });
  });

  describe("remove", () => {
    test("should delete a symptom", async () => {
      const deletedSymptom = {
        id: 1,
        name: "Fever",
        description: "High temperature",
      };

      mockPrismaClient.symptom.delete.mockResolvedValue(deletedSymptom);
      mockRequest.params = { id: "1" };

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.symptom.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
