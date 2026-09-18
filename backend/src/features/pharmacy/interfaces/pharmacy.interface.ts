/**
 * @file pharmacy.interface.ts
 * @description Interfaces metiers pour les pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Pharmacy as PrismaPharmacy, Country, Medicine } from "@prisma/client";

export interface PharmacyWithDetails extends PrismaPharmacy {
  readonly country?: Country;
  readonly medicines?: Medicine[];
}
