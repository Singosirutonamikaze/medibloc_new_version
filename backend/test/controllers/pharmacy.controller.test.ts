import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { PharmacyController } from "../../src/controllers/pharmacy.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("PharmacyController", () => {
  let pharmacyController: PharmacyController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    pharmacyController = new PharmacyController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllPharmacies", () => {
    test("should return all pharmacies with pagination", async () => {
      const mockPharmacies = [
        { id: 1, name: "Pharmacie de la Santé", address: "123 Rue Principale", city: "Lomé", countryId: 1 },
        { id: 2, name: "Pharmacie Centrale", address: "456 Avenue Centrale", city: "Lomé", countryId: 1 },
      ];

      mockPrismaClient.pharmacy.findMany.mockResolvedValue(mockPharmacies);
      mockPrismaClient.pharmacy.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await pharmacyController.getAllPharmacies(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.pharmacy.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockPharmacies,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getPharmacyById", () => {
    test("should return a pharmacy by ID", async () => {
      const mockPharmacy = {
        id: 1,
        name: "Pharmacie de la Santé",
        address: "123 Rue Principale",
        city: "Lomé",
        countryId: 1,
      };

      mockPrismaClient.pharmacy.findUnique.mockResolvedValue(mockPharmacy);
      mockRequest.params = { id: "1" };

      await pharmacyController.getPharmacyById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.pharmacy.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
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

      await pharmacyController.getPharmacyById(
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

  describe("createPharmacy", () => {
    test("should create a new pharmacy", async () => {
      const newPharmacy = {
        name: "Pharmacie de la Santé",
        address: "123 Rue Principale",
        city: "Lomé",
        countryId: 1,
      };

      const createdPharmacy = { id: 1, ...newPharmacy };

      mockPrismaClient.pharmacy.create.mockResolvedValue(createdPharmacy);
      mockRequest.body = newPharmacy;

      await pharmacyController.createPharmacy(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.pharmacy.create).toHaveBeenCalledWith({
        data: newPharmacy,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdPharmacy,
        })
      );
    });
  });

  describe("updatePharmacy", () => {
    test("should update a pharmacy", async () => {
      const updatedData = { address: "789 Nouvelle Adresse" };
      const updatedPharmacy = {
        id: 1,
        name: "Pharmacie de la Santé",
        address: "789 Nouvelle Adresse",
        city: "Lomé",
        countryId: 1,
      };

      mockPrismaClient.pharmacy.update.mockResolvedValue(updatedPharmacy);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await pharmacyController.updatePharmacy(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.pharmacy.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedPharmacy,
        })
      );
    });
  });

  describe("deletePharmacy", () => {
    test("should delete a pharmacy", async () => {
      const deletedPharmacy = {
        id: 1,
        name: "Pharmacie de la Santé",
        address: "123 Rue Principale",
        city: "Lomé",
        countryId: 1,
      };

      mockPrismaClient.pharmacy.delete.mockResolvedValue(deletedPharmacy);
      mockRequest.params = { id: "1" };

      await pharmacyController.deletePharmacy(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.pharmacy.delete).toHaveBeenCalledWith({
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
