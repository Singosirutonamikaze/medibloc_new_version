import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Prescription Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/prescriptions", () => {
    test("should return list of prescriptions", async () => {
      const res = await request(app).get("/api/v1/prescriptions");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/prescriptions", () => {
    test("should create a new prescription", async () => {
      const payload = {
        patientId: 1,
        doctorId: 1,
        medications: "Aspirin 500mg",
        instructions: "Take twice daily",
      };

      const res = await request(app)
        .post("/api/v1/prescriptions")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/prescriptions/:id", () => {
    test("should return a prescription by ID", async () => {
      const res = await request(app).get("/api/v1/prescriptions/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("DELETE /api/v1/prescriptions/:id", () => {
    test("should delete a prescription", async () => {
      const res = await request(app).delete("/api/v1/prescriptions/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/prescriptions/patient/:patientId", () => {
    test("should return prescriptions for a patient", async () => {
      const res = await request(app).get("/api/v1/prescriptions/patient/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/prescriptions/doctor/:doctorId", () => {
    test("should return prescriptions for a doctor", async () => {
      const res = await request(app).get("/api/v1/prescriptions/doctor/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
