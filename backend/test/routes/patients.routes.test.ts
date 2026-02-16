import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Patient Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/patients", () => {
    test("should return list of patients", async () => {
      const res = await request(app).get("/api/v1/patients");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty("firstName");
      expect(res.body.data[0]).toHaveProperty("lastName");
    });
  });

  describe("POST /api/v1/patients", () => {
    test("should create a new patient", async () => {
      const payload = {
        firstName: "koffi",
        lastName: "komla",
        email: "koffi@example.com",
        password: "secret123",
      };

      const res = await request(app)
        .post("/api/v1/patients")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe("koffi");
      expect(res.body.data.lastName).toBe("komla");
    });
  });

  describe("GET /api/v1/patients/:id", () => {
    test("should return a patient by ID", async () => {
      const res = await request(app).get("/api/v1/patients/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/patients/:id", () => {
    test("should update a patient", async () => {
      const payload = {
        firstName: "Updated Name",
      };

      const res = await request(app)
        .put("/api/v1/patients/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/patients/:id", () => {
    test("should delete a patient", async () => {
      const res = await request(app).delete("/api/v1/patients/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/patients/:id/diseases", () => {
    test("should return patient diseases", async () => {
      const res = await request(app).get("/api/v1/patients/1/diseases");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/patients/:id/appointments", () => {
    test("should return patient appointments", async () => {
      const res = await request(app).get("/api/v1/patients/1/appointments");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/patients/:id/prescriptions", () => {
    test("should return patient prescriptions", async () => {
      const res = await request(app).get("/api/v1/patients/1/prescriptions");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
