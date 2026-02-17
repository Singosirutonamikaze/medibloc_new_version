export interface Pharmacy {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  countryId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePharmacyDto {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  countryId?: number;
}

export interface UpdatePharmacyDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  countryId?: number;
}
