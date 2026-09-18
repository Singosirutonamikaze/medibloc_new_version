import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  getSpecialties,
} from "../../src/features/doctor/controllers/doctor.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("DoctorController", () => {
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
    test("should return all doctors", async () => {
      const mockDoctors = [
        {
          id: 1,
          specialty: "Cardiology",
          user: { firstName: "Dr. Koffi", lastName: "Komla", email: "doctor@example.com" },
        },
      ];

      mockPrismaClient.doctor.findMany.mockResolvedValue(mockDoctors);

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.doctor.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockDoctors,
        })
      );
    });
  });

  describe("getById", () => {
    test("should return a doctor by ID", async () => {
      const mockDoctor = {
        id: 1,
        specialty: "Cardiology",
        user: { firstName: "Dr. Koffi", lastName: "Komla", email: "doctor@example.com" },
      };

      mockPrismaClient.doctor.findUnique.mockResolvedValue(mockDoctor);
      mockRequest.params = { id: "1" };

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.doctor.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockDoctor,
        })
      );
    });

    test("should return 404 when doctor not found", async () => {
      mockPrismaClient.doctor.findUnique.mockResolvedValue(null);
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
    test("should create a new doctor", async () => {
      const newDoctor = {
        userId: 1,
        specialty: "Cardiology",
      };

      const createdDoctor = { id: 1, ...newDoctor };

      mockPrismaClient.doctor.create.mockResolvedValue(createdDoctor);
      mockRequest.body = newDoctor;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.doctor.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdDoctor,
        })
      );
    });
  });

  describe("update", () => {
    test("should update a doctor", async () => {
      const updatedData = { specialty: "Neurology" };
      const updatedDoctor = {
        id: 1,
        specialty: "Neurology",
      };

      mockPrismaClient.doctor.update.mockResolvedValue(updatedDoctor);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.doctor.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedDoctor,
        })
      );
    });
  });

  describe("remove", () => {
    test("should delete a doctor", async () => {
      const deletedDoctor = {
        id: 1,
      };

      mockPrismaClient.doctor.delete.mockResolvedValue(deletedDoctor);
      mockRequest.params = { id: "1" };

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.doctor.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe("getSpecialties", () => {
    test("should return list of specialties", async () => {
      const mockDoctors = [
        { specialty: "Cardiology" },
        { specialty: "Dermatology" },
      ];

      mockPrismaClient.doctor.findMany.mockResolvedValue(mockDoctors);

      await getSpecialties(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.doctor.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
