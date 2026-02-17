import { describe, it, expect } from 'vitest';
import type { Medicine, CreateMedicineDto } from '../../../types/medicine/medicine.types';

describe('Medicine Types', () => {
  it('devrait valider le type Medicine', () => {
    const medicine: Medicine = {
      id: 1,
      name: 'Aspirin',
      description: 'Pain reliever',
      type: 'PHARMACEUTICAL',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    expect(medicine.id).toBe(1);
    expect(medicine.name).toBe('Aspirin');
  });

  it('devrait valider CreateMedicineDto', () => {
    const createDto: CreateMedicineDto = {
      name: 'Ibuprofen',
      description: 'Anti-inflammatory',
      type: 'PHARMACEUTICAL',
    };

    expect(createDto.name).toBe('Ibuprofen');
  });
});

