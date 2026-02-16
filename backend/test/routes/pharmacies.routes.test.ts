import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Pharmacy Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/pharmacies", () => {
    test("should return list of pharmacies", async () => {
      const res = await request(app).get("/api/v1/pharmacies");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/pharmacies", () => {
    test("should create a new pharmacy", async () => {
      const payload = {
        name: "Pharmacy Central",
        address: "123 Main St",
        city: "Lomé",
        countryId: 1,
        phone: "+1234567890",
      };

      const res = await request(app)
        .post("/api/v1/pharmacies")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/pharmacies/:id", () => {
    test("should return a pharmacy by ID", async () => {
      const res = await request(app).get("/api/v1/pharmacies/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/pharmacies/:id", () => {
    test("should update a pharmacy", async () => {
      const payload = {
        name: "Updated Pharmacy",
      };

      const res = await request(app)
        .put("/api/v1/pharmacies/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/pharmacies/:id", () => {
    test("should delete a pharmacy", async () => {
      const res = await request(app).delete("/api/v1/pharmacies/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/pharmacies/country/:countryId", () => {
    test("should return pharmacies by country", async () => {
      const res = await request(app).get("/api/v1/pharmacies/country/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/pharmacies/:id/medicines", () => {
    test("should return medicines of a pharmacy", async () => {
      const res = await request(app).get("/api/v1/pharmacies/1/medicines");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
