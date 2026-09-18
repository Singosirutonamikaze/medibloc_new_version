import request from "supertest";
import { describe, test, expect, beforeAll, vi } from "vitest";
import { createTestApp } from "../setup/testApp";
import { mockPrismaClient } from "../setup/prismaMock";
import type express from "express";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("$2a$10$hashedPassword"),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue("$2a$10$hashedPassword"),
  compare: vi.fn().mockResolvedValue(true),
}));

describe("Auth Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("POST /api/v1/auth/register", () => {
    test("should register a new user successfully", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaClient.user.create.mockResolvedValueOnce({
        id: 1,
        email: "koffi@example.com",
        firstName: "koffi",
        lastName: "komla",
        role: "PATIENT",
        avatarUrl: null,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const payload = {
        email: "koffi@example.com",
        password: "secret123",
        firstName: "koffi",
        lastName: "komla",
      };

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.firstName).toBe("koffi");
      expect(res.body.data.user.lastName).toBe("komla");
      expect(res.body.data).toHaveProperty("token");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    test("should login and return a token", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: "koffi@example.com",
        password: "$2a$10$hashedPassword",
        firstName: "koffi",
        lastName: "komla",
        role: "PATIENT",
        avatarUrl: null,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const payload = {
        email: "koffi@example.com",
        password: "secret123",
      };

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user.email).toBe("koffi@example.com");
    });
  });


  describe("GET /api/v1/auth/me", () => {
    test("should return current user", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: "admin@medibloc.com",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        avatarUrl: null,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("email");
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    test("should logout successfully", async () => {
      const res = await request(app).post("/api/v1/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

