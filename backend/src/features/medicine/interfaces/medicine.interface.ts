/**
 * @file medicine.interface.ts
 * @description Interfaces pour les medicaments et produits pharmaceutiques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Medicine as PrismaMedicine, Pharmacy } from "@prisma/client";

export interface MedicineWithPharmacy extends PrismaMedicine {
  readonly pharmacy?: Pharmacy | null;
}
