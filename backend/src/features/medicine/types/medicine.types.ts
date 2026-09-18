/**
 * @file medicine.types.ts
 * @description Types specifiques aux medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Medicine, Pharmacy } from "@prisma/client";

export type MedicineDetail = Medicine & {
  readonly pharmacy: Pharmacy | null;
};
