import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";
import { createTestApp } from "../setup/testApp";
import "../setup/mocks";
import type express from "express";

describe("Symptom Routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe("GET /api/v1/symptoms", () => {
    test("should return list of symptoms", async () => {
      const res = await request(app).get("/api/v1/symptoms");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/symptoms", () => {
    test("should create a new symptom", async () => {
      const payload = {
        name: "Fever",
        severity: "moderate",
      };

      const res = await request(app)
        .post("/api/v1/symptoms")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/symptoms/:id", () => {
    test("should return a symptom by ID", async () => {
      const res = await request(app).get("/api/v1/symptoms/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
    });
  });

  describe("PUT /api/v1/symptoms/:id", () => {
    test("should update a symptom", async () => {
      const payload = {
        name: "High Fever",
      };

      const res = await request(app)
        .put("/api/v1/symptoms/1")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/symptoms/:id", () => {
    test("should delete a symptom", async () => {
      const res = await request(app).delete("/api/v1/symptoms/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/symptoms/:id/diseases", () => {
    test("should return diseases associated with symptom", async () => {
      const res = await request(app).get("/api/v1/symptoms/1/diseases");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
