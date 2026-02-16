import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { DoctorController } from "../../src/controllers/doctor.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("DoctorController", () => {
  let doctorController: DoctorController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    doctorController = new DoctorController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllDoctors", () => {
    test("should return all doctors with pagination", async () => {
      const mockDoctors = [
        {
          id: 1,
          firstName: "Dr. Koffi",
          lastName: "Komla",
          email: "doctor@example.com",
          specialty: "Cardiology",
        },
        {
          id: 2,
          firstName: "Dr. Ama",
          lastName: "Ayawa",
          email: "ama@example.com",
          specialty: "Dermatology",
        },
      ];

      mockPrismaClient.doctor.findMany.mockResolvedValue(mockDoctors);
      mockPrismaClient.doctor.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await doctorController.getAllDoctors(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.doctor.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockDoctors,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getDoctorById", () => {
    test("should return a doctor by ID", async () => {
      const mockDoctor = {
        id: 1,
        firstName: "Dr. Koffi",
        lastName: "Komla",
        email: "doctor@example.com",
        specialty: "Cardiology",
      };

      mockPrismaClient.doctor.findUnique.mockResolvedValue(mockDoctor);
      mockRequest.params = { id: "1" };

      await doctorController.getDoctorById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.doctor.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
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

      await doctorController.getDoctorById(
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

  describe("createDoctor", () => {
    test("should create a new doctor", async () => {
      const newDoctor = {
        firstName: "Dr. Koffi",
        lastName: "Komla",
        email: "doctor@example.com",
        password: "hashedPassword123",
        specialty: "Cardiology",
      };

      const createdDoctor = { id: 1, ...newDoctor };

      mockPrismaClient.doctor.create.mockResolvedValue(createdDoctor);
      mockRequest.body = newDoctor;

      await doctorController.createDoctor(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.doctor.create).toHaveBeenCalledWith({
        data: newDoctor,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdDoctor,
        })
      );
    });
  });

  describe("updateDoctor", () => {
    test("should update a doctor", async () => {
      const updatedData = { specialty: "Neurology" };
      const updatedDoctor = {
        id: 1,
        firstName: "Dr. Koffi",
        lastName: "Komla",
        email: "doctor@example.com",
        specialty: "Neurology",
      };

      mockPrismaClient.doctor.update.mockResolvedValue(updatedDoctor);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await doctorController.updateDoctor(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.doctor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedDoctor,
        })
      );
    });
  });

  describe("deleteDoctor", () => {
    test("should delete a doctor", async () => {
      const deletedDoctor = {
        id: 1,
        firstName: "Dr. Koffi",
        lastName: "Komla",
        email: "doctor@example.com",
      };

      mockPrismaClient.doctor.delete.mockResolvedValue(deletedDoctor);
      mockRequest.params = { id: "1" };

      await doctorController.deleteDoctor(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.doctor.delete).toHaveBeenCalledWith({
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

  describe("getSpecialties", () => {
    test("should return list of specialties", async () => {
      const mockDoctors = [
        { specialty: "Cardiology" },
        { specialty: "Dermatology" },
        { specialty: "Cardiology" },
      ];

      mockPrismaClient.doctor.findMany.mockResolvedValue(mockDoctors);

      await doctorController.getSpecialties(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.doctor.findMany).toHaveBeenCalledWith({
        select: { specialty: true },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining(["Cardiology", "Dermatology"]),
        })
      );
    });
  });
});
