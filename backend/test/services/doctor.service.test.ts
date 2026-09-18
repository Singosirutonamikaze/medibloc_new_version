import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllDoctors,
  findDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  findDoctorSpecialties,
} from "../../src/features/doctor/services/doctor.service";

describe("DoctorService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllDoctors", () => {
    test("should return list of all doctors", async () => {
      const mockDoctors = [
        { id: 1, userId: 2, specialty: "Cardiologie", user: { firstName: "Dr. Koffi" } },
      ];
      mockPrismaClient.doctor.findMany.mockResolvedValue(mockDoctors);

      const result = await findAllDoctors();

      expect(mockPrismaClient.doctor.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockDoctors);
    });
  });

  describe("findDoctorById", () => {
    test("should return doctor when found", async () => {
      const mockDoctor = { id: 1, userId: 2, specialty: "Cardiologie" };
      mockPrismaClient.doctor.findUnique.mockResolvedValue(mockDoctor);

      const result = await findDoctorById(1);

      expect(mockPrismaClient.doctor.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockDoctor);
    });

    test("should throw error when doctor not found", async () => {
      mockPrismaClient.doctor.findUnique.mockResolvedValue(null);

      await expect(findDoctorById(999)).rejects.toThrow("Medecin introuvable");
    });
  });

  describe("createDoctor", () => {
    test("should create and return a doctor", async () => {
      const dto = { userId: 2, specialty: "Cardiologie" };
      const created = { id: 1, ...dto };
      mockPrismaClient.doctor.create.mockResolvedValue(created);

      const result = await createDoctor(dto);

      expect(mockPrismaClient.doctor.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe("updateDoctor", () => {
    test("should update and return the doctor", async () => {
      const dto = { specialty: "Neurologie" };
      const updated = { id: 1, userId: 2, specialty: "Neurologie" };
      mockPrismaClient.doctor.update.mockResolvedValue(updated);

      const result = await updateDoctor(1, dto);

      expect(mockPrismaClient.doctor.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });

  describe("deleteDoctor", () => {
    test("should delete and return deleted doctor", async () => {
      const deleted = { id: 1, userId: 2 };
      mockPrismaClient.doctor.delete.mockResolvedValue(deleted);

      const result = await deleteDoctor(1);

      expect(mockPrismaClient.doctor.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });

  describe("findDoctorSpecialties", () => {
    test("should return distinct list of specialties", async () => {
      const mockList = [{ specialty: "Cardiologie" }, { specialty: "Pediatrie" }];
      mockPrismaClient.doctor.findMany.mockResolvedValue(mockList);

      const result = await findDoctorSpecialties();

      expect(result).toEqual(["Cardiologie", "Pediatrie"]);
    });
  });
});

