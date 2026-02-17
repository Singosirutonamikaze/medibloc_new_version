import { describe, it, expect } from 'vitest';
import type { Pharmacy, CreatePharmacyDto } from '../../../types/pharmacy/pharmacy.types';

describe('Pharmacy Types', () => {
  it('devrait valider le type Pharmacy', () => {
    const pharmacy: Pharmacy = {
      id: 1,
      name: 'Central Pharmacy',
      address: '123 Main St',
      phone: '+1234567890',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    expect(pharmacy.id).toBe(1);
    expect(pharmacy.name).toBe('Central Pharmacy');
  });

  it('devrait valider CreatePharmacyDto', () => {
    const createDto: CreatePharmacyDto = {
      name: 'Downtown Pharmacy',
      address: '456 Side Ave',
      phone: '+0987654321',
    };

    expect(createDto.name).toBe('Downtown Pharmacy');
  });
});
