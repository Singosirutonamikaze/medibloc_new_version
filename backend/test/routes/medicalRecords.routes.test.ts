import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Medical Record Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/medical-records", () => {
    test("should return list of medical records", async () => {
      const res = await request(app).get("/api/v1/medical-records");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/medical-records", () => {
    test("should create a new medical record", async () => {
      const payload = {
        patientId: 1,
        title: "Annual Checkup",
        content: "Patient is in good health",
        recordDate: new Date().toISOString(),
      };

      const res = await request(app)
        .post("/api/v1/medical-records")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/medical-records/:id", () => {
    test("should return a medical record by ID", async () => {
      const res = await request(app).get("/api/v1/medical-records/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/medical-records/:id", () => {
    test("should update a medical record", async () => {
      const payload = {
        title: "Updated Record",
      };

      const res = await request(app)
        .put("/api/v1/medical-records/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/medical-records/:id", () => {
    test("should delete a medical record", async () => {
      const res = await request(app).delete("/api/v1/medical-records/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/medical-records/patient/:patientId", () => {
    test("should return medical records for a patient", async () => {
      const res = await request(app).get("/api/v1/medical-records/patient/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
