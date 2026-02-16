import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Stats Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/stats/dashboard", () => {
    test("should return dashboard statistics", async () => {
      const res = await request(app).get("/api/v1/stats/dashboard");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("totalPatients");
      expect(res.body.data).toHaveProperty("totalAppointments");
    });
  });

  describe("GET /api/v1/stats/diseases", () => {
    test("should return disease statistics", async () => {
      const res = await request(app).get("/api/v1/stats/diseases");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/stats/appointments", () => {
    test("should return appointment statistics", async () => {
      const res = await request(app).get("/api/v1/stats/appointments");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/stats/patients", () => {
    test("should return patient statistics", async () => {
      const res = await request(app).get("/api/v1/stats/patients");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("activePatients");
    });
  });
});
