import { vi, type Mock } from "vitest";
import type { Request, Response } from "express";
import type { AuthRequest } from "../../src/core/types/global/global.types";

/**
 * @description Crée un mock de Response avec des types stricts.
 * Ce qui veut dire que les fonctions mockJson et mockStatus sont correctement typées pour correspondre aux méthodes de Response.
 *
 * @test helper
 * @return Un objet contenant le mock de Response, ainsi que les fonctions mockJson et mockStatus.
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export function createMockResponse(): {
  mockResponse: Response;
  mockJson: Mock;
  mockStatus: Mock;
} {
  const mockJson = vi.fn();
  const mockStatus = vi.fn().mockReturnValue({
    json: mockJson,
  });

  const mockResponse = {
    json: mockJson,
    status: mockStatus,
  } as unknown as Response;

  return {
    mockResponse,
    mockJson,
    mockStatus,
  };
}

/**
 * Crée un mock de Request standard.
 */
export function createMockRequest(overrides?: Partial<Request>): Request {
  return {
    query: {},
    params: {},
    body: {},
    ...overrides,
  } as unknown as Request;
}

/**
 * Crée un mock de AuthRequest avec utilisateur authentifié.
 */
export function createMockAuthRequest(
  overrides?: Partial<AuthRequest>,
): AuthRequest {
  return {
    query: {},
    params: {},
    body: {},
    user: { id: 1, email: "admin@example.com", role: "ADMIN" },
    ...overrides,
  } as unknown as AuthRequest;
}
