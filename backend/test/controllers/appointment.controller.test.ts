import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { AppointmentController } from "../../src/controllers/appointment.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("AppointmentController", () => {
  let appointmentController: AppointmentController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    appointmentController = new AppointmentController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllAppointments", () => {
    test("should return all appointments with pagination", async () => {
      const mockAppointments = [
        {
          id: 1,
          patientId: 1,
          doctorId: 1,
          scheduledAt: new Date(),
          status: "PENDING",
        },
        {
          id: 2,
          patientId: 2,
          doctorId: 1,
          scheduledAt: new Date(),
          status: "CONFIRMED",
        },
      ];

      mockPrismaClient.appointment.findMany.mockResolvedValue(mockAppointments);
      mockPrismaClient.appointment.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await appointmentController.getAllAppointments(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.appointment.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockAppointments,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getAppointmentById", () => {
    test("should return an appointment by ID", async () => {
      const mockAppointment = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date(),
        status: "PENDING",
      };

      mockPrismaClient.appointment.findUnique.mockResolvedValue(mockAppointment);
      mockRequest.params = { id: "1" };

      await appointmentController.getAppointmentById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockAppointment,
        })
      );
    });
  });

  describe("createAppointment", () => {
    test("should create a new appointment", async () => {
      const newAppointment = {
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date(),
        reason: "Check-up",
      };

      const createdAppointment = { id: 1, ...newAppointment, status: "PENDING" };

      mockPrismaClient.appointment.create.mockResolvedValue(createdAppointment);
      mockRequest.body = newAppointment;

      await appointmentController.createAppointment(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.appointment.create).toHaveBeenCalledWith({
        data: newAppointment,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdAppointment,
        })
      );
    });
  });

  describe("updateAppointmentStatus", () => {
    test("should update appointment status", async () => {
      const updatedAppointment = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date(),
        status: "CONFIRMED",
      };

      mockPrismaClient.appointment.update.mockResolvedValue(updatedAppointment);
      mockRequest.params = { id: "1" };
      mockRequest.body = { status: "CONFIRMED" };

      await appointmentController.updateAppointmentStatus(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.appointment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: "CONFIRMED" },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedAppointment,
        })
      );
    });
  });

  describe("deleteAppointment", () => {
    test("should delete an appointment", async () => {
      const deletedAppointment = {
        id: 1,
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date(),
        status: "CANCELLED",
      };

      mockPrismaClient.appointment.delete.mockResolvedValue(deletedAppointment);
      mockRequest.params = { id: "1" };

      await appointmentController.deleteAppointment(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.appointment.delete).toHaveBeenCalledWith({
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
