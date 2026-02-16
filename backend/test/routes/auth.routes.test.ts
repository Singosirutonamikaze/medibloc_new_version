import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Auth Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("POST /api/v1/auth/register", () => {
    test("should register a new user successfully", async () => {
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
      expect(res.body.data.firstName).toBe("koffi");
      expect(res.body.data.lastName).toBe("komla");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    test("should login and return a token", async () => {
      const payload = {
        email: "koffi@example.com",
        password: "secret123",
      };

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
      expect(res.body.data.email).toBe("koffi@example.com");
    });
  });

  describe("GET /api/v1/auth/me", () => {
    test("should return current user", async () => {
      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("email");
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    test("should refresh the token", async () => {
      const res = await request(app).post("/api/v1/auth/refresh");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
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
