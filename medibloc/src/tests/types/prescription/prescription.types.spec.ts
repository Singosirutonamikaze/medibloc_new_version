import { describe, it, expect } from 'vitest';
import type { Prescription, CreatePrescriptionDto } from '../../../types/prescription/prescription.types';

describe('Prescription Types', () => {
  it('devrait valider le type Prescription', () => {
    const prescription: Prescription = {
      id: 1,
      doctorId: 1,
      patientId: 1,
      medications: 'Aspirin',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    expect(prescription.id).toBe(1);
    expect(prescription.doctorId).toBe(1);
  });

  it('devrait valider CreatePrescriptionDto', () => {
    const createDto: CreatePrescriptionDto = {
      doctorId: 1,
      patientId: 1,
      medications: 'Ibuprofen',
    };

    expect(createDto.doctorId).toBe(1);
    expect(createDto.patientId).toBe(1);
  });
});

