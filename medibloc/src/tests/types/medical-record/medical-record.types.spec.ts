import { describe, it, expect } from 'vitest';
import type { MedicalRecord, CreateMedicalRecordDto } from '../../../types/medical-record/medical-record.types';

describe('MedicalRecord Types', () => {
  it('devrait valider le type MedicalRecord', () => {
    const record: MedicalRecord = {
      id: 1,
      patientId: 1,
      recordDate: '2024-01-15T10:30:00Z',
      diagnosis: 'Common cold',
      treatment: 'Rest and fluids',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    expect(record.id).toBe(1);
    expect(record.patientId).toBe(1);
    expect(record.diagnosis).toBe('Common cold');
  });

  it('devrait valider CreateMedicalRecordDto', () => {
    const createDto: CreateMedicalRecordDto = {
      patientId: 1,
      recordDate: '2024-01-15T10:30:00Z',
      diagnosis: 'Flu',
      treatment: 'Antiviral medication',
    };

    expect(createDto.patientId).toBe(1);
    expect(createDto.diagnosis).toBe('Flu');
  });
});

