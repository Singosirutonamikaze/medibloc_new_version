import { describe, it, expect } from 'vitest';
import type { Patient, CreatePatientDto } from '../../../types/patient/patient.types';

describe('Patient Types', () => {
  it('devrait valider le type Patient', () => {
    const patient: Patient = {
      id: 1,
      userId: 1,
      birthDate: '1990-01-15',
    };

    expect(patient.id).toBe(1);
    expect(patient.userId).toBe(1);
  });

  it('devrait valider CreatePatientDto', () => {
    const createDto: CreatePatientDto = {
      userId: 1,
    };

    expect(createDto.userId).toBe(1);
  });
});

