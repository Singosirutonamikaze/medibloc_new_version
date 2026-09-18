import { describe, test, expect, beforeEach } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} from "../../src/features/user/services/user.service";

describe("UserService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("findAllUsers", () => {
    test("should return list of all users", async () => {
      const mockUsers = [
        { id: 1, email: "user1@example.com", role: "PATIENT" },
      ];
      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      const result = await findAllUsers();

      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe("findUserById", () => {
    test("should return user when found", async () => {
      const mockUser = { id: 1, email: "user1@example.com", role: "PATIENT" };
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const result = await findUserById(1);

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } })
      );
      expect(result).toEqual(mockUser);
    });


    test("should throw error when user not found", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      await expect(findUserById(999)).rejects.toThrow("Utilisateur introuvable");
    });
  });

  describe("updateUser", () => {
    test("should update and return the user", async () => {
      const dto = { firstName: "Jane" };
      const updated = { id: 1, email: "user1@example.com", firstName: "Jane" };
      mockPrismaClient.user.update.mockResolvedValue(updated);

      const result = await updateUser(1, dto);

      expect(mockPrismaClient.user.update).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });

  describe("deleteUser", () => {
    test("should delete and return deleted user", async () => {
      const deleted = { id: 1, email: "user1@example.com" };
      mockPrismaClient.user.delete.mockResolvedValue(deleted);

      const result = await deleteUser(1);

      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(deleted);
    });
  });
});
