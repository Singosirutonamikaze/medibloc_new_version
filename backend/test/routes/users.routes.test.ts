import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("User Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/users", () => {
    test("should return list of users", async () => {
      const res = await request(app).get("/api/v1/users");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/users/:id", () => {
    test("should return a user by ID", async () => {
      const res = await request(app).get("/api/v1/users/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/users/:id", () => {
    test("should update a user", async () => {
      const payload = {
        email: "updated@example.com",
      };

      const res = await request(app)
        .put("/api/v1/users/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/users/:id", () => {
    test("should delete a user", async () => {
      const res = await request(app).delete("/api/v1/users/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/users/profile/me", () => {
    test("should return current user profile", async () => {
      const res = await request(app).get("/api/v1/users/profile/me");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("email");
    });
  });
});
