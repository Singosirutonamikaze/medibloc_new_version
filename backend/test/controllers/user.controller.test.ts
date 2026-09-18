import { describe, test, expect, beforeEach, type Mock } from "vitest";
import { mockPrismaClient, resetAllMocks } from "../setup/prismaMock";
import {
  getAll,
  getById,
  update,
  remove,
  getProfile,
} from "../../src/features/user/controllers/user.controller";
import type { Request, Response } from "express";
import {
  createMockRequest,
  createMockAuthRequest,
  createMockResponse,
} from "../setup/test-helpers";
import { AuthRequest } from "../../src/core/types/global/global.types";

describe("UserController", () => {
  let mockRequest: Request;
  let mockAuthRequest: AuthRequest;
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
    mockAuthRequest = createMockAuthRequest();
  });

  describe("getAll", () => {
    test("should return all users", async () => {
      const mockUsers = [
        { id: 1, email: "user1@example.com", role: "PATIENT" },
        { id: 2, email: "admin@example.com", role: "ADMIN" },
      ];

      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      await getAll(mockRequest, mockResponse);

      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockUsers,
        })
      );
    });
  });

  describe("getById", () => {
    test("should return a user by ID", async () => {
      const mockUser = {
        id: 1,
        email: "user1@example.com",
        role: "PATIENT",
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockRequest.params = { id: "1" };

      await getById(mockRequest, mockResponse);

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalled();
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

      await getById(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });

  describe("getProfile", () => {
    test("should return current user profile", async () => {
      const mockUser = {
        id: 1,
        email: "admin@example.com",
        role: "ADMIN",
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      await getProfile(mockAuthRequest, mockResponse);

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockUser,
        })
      );
    });
  });

  describe("update", () => {
    test("should update a user", async () => {
      const updatedData = { firstName: "Updated" };
      const updatedUser = {
        id: 1,
        email: "user1@example.com",
        firstName: "Updated",
      };

      mockPrismaClient.user.update.mockResolvedValue(updatedUser);
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;

      await update(mockRequest, mockResponse);

      expect(mockPrismaClient.user.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: updatedUser,
        })
      );
    });
  });

  describe("remove", () => {
    test("should delete a user", async () => {
      const deletedUser = {
        id: 1,
      };

      mockPrismaClient.user.delete.mockResolvedValue(deletedUser);
      mockRequest.params = { id: "1" };

      await remove(mockRequest, mockResponse);

      expect(mockPrismaClient.user.delete).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
