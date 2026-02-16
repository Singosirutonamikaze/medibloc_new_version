import { type Mock } from "vitest";
import type { PrismaClient } from "@prisma/client";
import prisma from "../../src/config/database";

// Type pour les modèles Prisma mockés
type MockedPrismaModel = {
  findMany: Mock;
  findUnique: Mock;
  findFirst: Mock;
  create: Mock;
  update: Mock;
  delete: Mock;
  count: Mock;
};

// Type pour le client Prisma mocké
export type MockedPrismaClient = {
  [K in keyof PrismaClient]: PrismaClient[K] extends { findMany: any }
  ? MockedPrismaModel
  : PrismaClient[K];
};

// Obtenir une référence au mock créé dans vitest.setup.ts
export const mockPrismaClient = prisma as unknown as MockedPrismaClient;

export const resetAllMocks = () => {
  Object.values(mockPrismaClient).forEach((model: any) => {
    if (typeof model === 'object' && model !== null) {
      Object.values(model).forEach((method: any) => {
        if (typeof method?.mockReset === 'function') {
          method.mockReset();
        }
      });
    }
  });
};
