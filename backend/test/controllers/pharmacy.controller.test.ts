import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  getByCountry,
  create,
  update,
  remove,
} from "../../src/features/pharmacy/controllers/pharmacy.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("PharmacyController", () => {
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
    test("should return all pharmacies", async () => {
      const mockPharmacies = [
        { id: 1, name: "Pharmacie de la Santé", address: "123 Rue Principale", city: "Lomé", countryId: 1 },
      ];

      mockPrismaClient.pharmacy.findMany.mockResolvedValue(mockPharmacies);

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.pharmacy.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPharmacies,
        })
      );
    });
  });

  describe("getById", () => {
    test("should return a pharmacy by ID", async () => {
      const mockPharmacy = {
        id: 1,
        name: "Pharmacie Centrale",
      };

      mockPrismaClient.pharmacy.findUnique.mockResolvedValue(mockPharmacy);
      mockRequest.params = { id: "1" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.pharmacy.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPharmacy,
        })
      );
    });

    test("should return 404 when pharmacy not found", async () => {
      mockPrismaClient.pharmacy.findUnique.mockResolvedValue(null);
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

  describe("getByCountry", () => {
    test("should return pharmacies by country", async () => {
      const mockPharmacies = [
        { id: 1, name: "Pharmacie Togo", countryId: 1 },
      ];

      mockPrismaClient.pharmacy.findMany.mockResolvedValue(mockPharmacies);
      mockRequest.params = { countryId: "1" };

      await getByCountry(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.pharmacy.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockPharmacies,
        })
      );
    });
  });

  describe("create", () => {
    test("should create a new pharmacy", async () => {
      const newPharmacy = {
        name: "Pharmacie Nouvelle",
        address: "Rue 10",
        city: "Lomé",
        countryId: 1,
      };

      const createdPharmacy = { id: 1, ...newPharmacy };

      mockPrismaClient.pharmacy.create.mockResolvedValue(createdPharmacy);
      mockRequest.body = newPharmacy;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.pharmacy.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdPharmacy,
        })
      );
    });
  });

  describe("update", () => {
    test("should update a pharmacy", async () => {
      const updatedData = { name: "Pharmacie Renovée" };
      const updatedPharmacy = {
        id: 1,
        name: "Pharmacie Renovée",
      };

      mockPrismaClient.pharmacy.update.mockResolvedValue(updatedPharmacy);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.pharmacy.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedPharmacy,
        })
      );
    });
  });

  describe("remove", () => {
    test("should delete a pharmacy", async () => {
      const deletedPharmacy = {
        id: 1,
      };

      mockPrismaClient.pharmacy.delete.mockResolvedValue(deletedPharmacy);
      mockRequest.params = { id: "1" };

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.pharmacy.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
