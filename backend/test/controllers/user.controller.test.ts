import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import { UserController } from "../../src/controllers/user.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockResponse,
} from "../setup/test-helpers";

describe("UserController", () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockJson: Mock;
  let mockStatus: Mock;

  beforeEach(() => {
    resetAllMocks();
    userController = new UserController();

    const mocks = createMockResponse();
    mockJson = mocks.mockJson;
    mockStatus = mocks.mockStatus;
    mockResponse = mocks.mockResponse;

    mockRequest = createMockRequest();
  });

  describe("getAllUsers", () => {
    test("should return all users with pagination", async () => {
      const mockUsers = [
        { id: 1, email: "user1@example.com", role: "USER" },
        { id: 2, email: "admin@example.com", role: "ADMIN" },
      ];

      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaClient.user.count.mockResolvedValue(2);

      mockRequest.query = { page: "1", limit: "10" };

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            data: mockUsers,
            pagination: expect.any(Object),
            success: true,
          }),
        })
      );
    });
  });

  describe("getUserById", () => {
    test("should return a user by ID", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        role: "USER",
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockRequest.params = { id: "1" };

      await userController.getUserById(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockUser,
        })
      );
    });

    test("should return 404 when user not found", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockRequest.params = { id: "999" };

      await userController.getUserById(
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

  // Note: UserController n'a pas de méthode createUser
  // La création d'utilisateurs se fait via le AuthController

  describe("updateUser", () => {
    test("should update a user", async () => {
      const updatedData = { role: "ADMIN" };
      const updatedUser = {
        id: 1,
        email: "user@example.com",
        role: "ADMIN",
      };

      mockPrismaClient.user.update.mockResolvedValue(updatedUser);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await userController.updateUser(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedUser,
        })
      );
    });
  });

  describe("deleteUser", () => {
    test("should delete a user", async () => {
      const deletedUser = {
        id: 1,
        email: "user@example.com",
        role: "USER",
      };

      mockPrismaClient.user.delete.mockResolvedValue(deletedUser);
      mockRequest.params = { id: "1" };

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse
      );

      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
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
