import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Doctor Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/doctors", () => {
    test("should return list of doctors", async () => {
      const res = await request(app).get("/api/v1/doctors");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/doctors", () => {
    test("should create a new doctor", async () => {
      const payload = {
        firstName: "Dr. Koffi",
        lastName: "Komla",
        email: "doctor@example.com",
        password: "securePassword123",
        specialty: "Cardiology",
      };

      const res = await request(app)
        .post("/api/v1/doctors")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/doctors/:id", () => {
    test("should return a doctor by ID", async () => {
      const res = await request(app).get("/api/v1/doctors/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/doctors/:id", () => {
    test("should update a doctor", async () => {
      const payload = {
        specialty: "Neurology",
      };

      const res = await request(app)
        .put("/api/v1/doctors/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/doctors/:id", () => {
    test("should delete a doctor", async () => {
      const res = await request(app).delete("/api/v1/doctors/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/doctors/:id/appointments", () => {
    test("should return doctor appointments", async () => {
      const res = await request(app).get("/api/v1/doctors/1/appointments");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/doctors/:id/prescriptions", () => {
    test("should return doctor prescriptions", async () => {
      const res = await request(app).get("/api/v1/doctors/1/prescriptions");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/doctors/specialties/list", () => {
    test("should return list of specialties", async () => {
      const res = await request(app).get("/api/v1/doctors/specialties/list");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
