import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Disease Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/diseases", () => {
    test("should return list of diseases", async () => {
      const res = await request(app).get("/api/v1/diseases");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/diseases", () => {
    test("should create a new disease", async () => {
      const payload = {
        name: "Test Disease",
        description: "A test disease",
      };

      const res = await request(app)
        .post("/api/v1/diseases")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/diseases/:id", () => {
    test("should return a disease by ID", async () => {
      const res = await request(app).get("/api/v1/diseases/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/diseases/:id", () => {
    test("should update a disease", async () => {
      const payload = {
        name: "Updated Disease",
      };

      const res = await request(app)
        .put("/api/v1/diseases/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/diseases/:id", () => {
    test("should delete a disease", async () => {
      const res = await request(app).delete("/api/v1/diseases/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/diseases/:id/symptoms", () => {
    test("should return disease symptoms", async () => {
      const res = await request(app).get("/api/v1/diseases/1/symptoms");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/v1/diseases/:id/countries", () => {
    test("should return disease countries", async () => {
      const res = await request(app).get("/api/v1/diseases/1/countries");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/diseases/:id/symptoms/:symptomId", () => {
    test("should add symptom to disease", async () => {
      const res = await request(app).post("/api/v1/diseases/1/symptoms/1");

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/diseases/:id/symptoms/:symptomId", () => {
    test("should remove symptom from disease", async () => {
      const res = await request(app).delete("/api/v1/diseases/1/symptoms/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
