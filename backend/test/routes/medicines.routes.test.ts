import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Medicine Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/medicines", () => {
    test("should return list of medicines", async () => {
      const res = await request(app).get("/api/v1/medicines");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/medicines", () => {
    test("should create a new medicine", async () => {
      const payload = {
        name: "Aspirin",
        type: "pill",
        dosage: "500mg",
      };

      const res = await request(app)
        .post("/api/v1/medicines")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/medicines/:id", () => {
    test("should return a medicine by ID", async () => {
      const res = await request(app).get("/api/v1/medicines/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/medicines/:id", () => {
    test("should update a medicine", async () => {
      const payload = {
        dosage: "1000mg",
      };

      const res = await request(app)
        .put("/api/v1/medicines/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/medicines/:id", () => {
    test("should delete a medicine", async () => {
      const res = await request(app).delete("/api/v1/medicines/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/medicines/type/:type", () => {
    test("should return medicines by type", async () => {
      const res = await request(app).get("/api/v1/medicines/type/pill");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/medicines/pharmacy/:pharmacyId", () => {
    test("should return medicines by pharmacy", async () => {
      const res = await request(app).get("/api/v1/medicines/pharmacy/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
