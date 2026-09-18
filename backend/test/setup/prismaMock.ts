import { type Mock } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "../../src/core/configs/database/database.config";

// Type pour les modèles Prisma mockés
type MockedPrismaModel = {
  findMany: Mock;
  findUnique: Mock;
  findFirst: Mock;
  create: Mock;
  update: Mock;
  delete: Mock;
  count: Mock;
  upsert?: Mock;
  updateMany?: Mock;
};

// Type pour le client Prisma mocké
export type MockedPrismaClient = {
  [K in keyof PrismaClient]: PrismaClient[K] extends { findMany: unknown }
    ? MockedPrismaModel
    : PrismaClient[K];
};

// Obtenir une référence au mock créé dans vitest.setup.ts
export const mockPrismaClient = prisma as unknown as MockedPrismaClient;

export const resetAllMocks = () => {
  const models = Object.values(mockPrismaClient);
  models.forEach((model) => {
    if (typeof model === "object" && model !== null) {
      const methods = Object.values(model as Record<string, unknown>);
      methods.forEach((method) => {
        if (typeof (method as { mockReset?: () => void })?.mockReset === "function") {
          (method as { mockReset: () => void }).mockReset();
        }
      });
    }
  });
};
