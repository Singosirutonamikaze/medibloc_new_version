import { describe, test, expect, beforeEach } from "vitest";
import { AppointmentStatus } from "@prisma/client";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllAppointments,
  findAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  findPatientAppointments,
  findDoctorAppointments,
} from "../../src/features/appointment/services/appointment.service";

describe("AppointmentService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllAppointments", () => {
    test("should return list of appointments", async () => {
      const mockAppointments = [
        { id: 1, patientId: 1, doctorId: 1, status: "CONFIRMED" },
      ];
      mockPrismaClient.appointment.findMany.mockResolvedValue(mockAppointments);

      const result = await findAllAppointments();

      expect(mockPrismaClient.appointment.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockAppointments);
    });
  });

  describe("findAppointmentById", () => {
    test("should return appointment when found", async () => {
      const mockAppointment = { id: 1, patientId: 1, doctorId: 1 };
      mockPrismaClient.appointment.findUnique.mockResolvedValue(mockAppointment);

      const result = await findAppointmentById(1);

      expect(mockPrismaClient.appointment.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockAppointment);
    });

    test("should throw error when appointment not found", async () => {
      mockPrismaClient.appointment.findUnique.mockResolvedValue(null);

      await expect(findAppointmentById(999)).rejects.toThrow("Rendez-vous introuvable");
    });
  });

  describe("createAppointment", () => {
    test("should create and return an appointment", async () => {
      const dto = {
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date().toISOString(),
        reason: "Consultation",
      };
      const created = { id: 1, ...dto, status: "PENDING" };
      mockPrismaClient.appointment.create.mockResolvedValue(created);

      const result = await createAppointment(dto);

      expect(mockPrismaClient.appointment.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updateAppointmentStatus", () => {
    test("should set appointment status to CANCELLED", async () => {
      const cancelled = { id: 1, status: AppointmentStatus.CANCELLED };
      mockPrismaClient.appointment.update.mockResolvedValue(cancelled);

      const result = await updateAppointmentStatus(1, AppointmentStatus.CANCELLED);

      expect(mockPrismaClient.appointment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { status: AppointmentStatus.CANCELLED },
        })
      );
      expect(result).toEqual(cancelled);
    });

    test("should set appointment status to COMPLETED", async () => {
      const completed = { id: 1, status: AppointmentStatus.COMPLETED };
      mockPrismaClient.appointment.update.mockResolvedValue(completed);

      const result = await updateAppointmentStatus(1, AppointmentStatus.COMPLETED);

      expect(mockPrismaClient.appointment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { status: AppointmentStatus.COMPLETED },
        })
      );
      expect(result).toEqual(completed);
    });
  });

  describe("findPatientAppointments", () => {
    test("should return patient appointments", async () => {
      const list = [{ id: 1, patientId: 1 }];
      mockPrismaClient.appointment.findMany.mockResolvedValue(list);

      const result = await findPatientAppointments(1);
      expect(result).toEqual(list);
    });
  });

  describe("findDoctorAppointments", () => {
    test("should return doctor appointments", async () => {
      const list = [{ id: 1, doctorId: 1 }];
      mockPrismaClient.appointment.findMany.mockResolvedValue(list);

      const result = await findDoctorAppointments(1);
      expect(result).toEqual(list);
    });
  });
});

