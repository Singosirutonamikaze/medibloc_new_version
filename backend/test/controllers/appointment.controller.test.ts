import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../../src/features/appointment/controllers/appointment.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("AppointmentController", () => {
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
    test("should return all appointments", async () => {
      const mockAppointments = [
        {
          id: 1,
          patientId: 1,
          doctorId: 1,
          scheduledAt: new Date(),
          status: "PENDING",
        },
      ];

      mockPrismaClient.appointment.findMany.mockResolvedValue(mockAppointments);

      await getAll(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.appointment.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockAppointments,
        })
      );
    });
  });

  describe("getById", () => {
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

      await getById(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.appointment.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockAppointment,
        })
      );
    });
  });

  describe("create", () => {
    test("should create a new appointment", async () => {
      const newAppointment = {
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date().toISOString(),
        reason: "Check-up",
      };

      const createdAppointment = { id: 1, ...newAppointment, status: "PENDING" };

      mockPrismaClient.appointment.create.mockResolvedValue(createdAppointment);
      mockRequest.body = newAppointment;

      await create(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.appointment.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdAppointment,
        })
      );
    });
  });

  describe("update", () => {
    test("should update appointment", async () => {
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

      await update(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.appointment.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedAppointment,
        })
      );
    });
  });

  describe("remove", () => {
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

      await remove(mockRequest as Request, mockResponse);

      expect(mockPrismaClient.appointment.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
