import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Appointment Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/appointments", () => {
    test("should return list of appointments", async () => {
      const res = await request(app).get("/api/v1/appointments");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/appointments", () => {
    test("should create a new appointment", async () => {
      const payload = {
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date().toISOString(),
        reason: "Check-up",
      };

      const res = await request(app)
        .post("/api/v1/appointments")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("patientId");
      expect(res.body.data).toHaveProperty("doctorId");
    });
  });

  describe("GET /api/v1/appointments/:id", () => {
    test("should return an appointment by ID", async () => {
      const res = await request(app).get("/api/v1/appointments/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/appointments/:id", () => {
    test("should update an appointment", async () => {
      const payload = {
        reason: "Follow-up visit",
      };

      const res = await request(app)
        .put("/api/v1/appointments/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/appointments/:id", () => {
    test("should delete an appointment", async () => {
      const res = await request(app).delete("/api/v1/appointments/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("PATCH /api/v1/appointments/:id/status", () => {
    test("should update appointment status", async () => {
      const payload = {
        status: "confirmed",
      };

      const res = await request(app)
        .patch("/api/v1/appointments/1/status")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("confirmed");
    });
  });

  describe("GET /api/v1/appointments/patient/:patientId", () => {
    test("should return appointments for a patient", async () => {
      const res = await request(app).get("/api/v1/appointments/patient/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/appointments/doctor/:doctorId", () => {
    test("should return appointments for a doctor", async () => {
      const res = await request(app).get("/api/v1/appointments/doctor/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
