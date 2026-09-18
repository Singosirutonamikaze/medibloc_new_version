/**
 * @file pharmacy.dto.ts
 * @description Objets de transfert de donnees pour la gestion des pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export interface CreatePharmacyDto {
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly countryId: number;
  readonly phone?: string;
  readonly email?: string;
}

export interface UpdatePharmacyDto {
  readonly name?: string;
  readonly address?: string;
  readonly city?: string;
  readonly countryId?: number;
  readonly phone?: string;
  readonly email?: string;
}
