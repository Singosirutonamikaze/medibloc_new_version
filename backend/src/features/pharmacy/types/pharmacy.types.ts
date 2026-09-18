/**
 * @file pharmacy.types.ts
 * @description Types pour les officines et pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Pharmacy, Country, Medicine } from "@prisma/client";

export type PharmacyFull = Pharmacy & {
  readonly country: Country;
  readonly medicines: Medicine[];
};
