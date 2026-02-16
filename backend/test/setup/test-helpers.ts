import { vi, type Mock } from "vitest";
import type { Request, Response } from "express";

/**
 * Crée un mock de Response avec des types stricts
 * Retourne un objet typé comme Response qui peut être utilisé sans casting
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
 * Crée un mock de Request avec des types stricts
 */
export function createMockRequest<
  TParams = Record<string, string>,
  TQuery = Record<string, string>,
  TBody = Record<string, string>
>(
  overrides?: Partial<Request<TParams, {}, TBody, TQuery>>
): Partial<Request<TParams, {}, TBody, TQuery>> {
  return {
    query: {} as TQuery,
    params: {} as TParams,
    body: {} as TBody,
    ...overrides,
  };
}
