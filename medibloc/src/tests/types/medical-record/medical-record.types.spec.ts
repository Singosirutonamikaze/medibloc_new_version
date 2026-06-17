import { describe, it, expect } from 'vitest';
import type { MedicalRecord, CreateMedicalRecordDto } from '../../../types/medical-record/medical-record.types';

describe('MedicalRecord Types', () => {
  it('devrait valider le type MedicalRecord', () => {
    const record: MedicalRecord = {
      id: 1,
      patientId: 1,
      title: 'Consultation Générale',
      content: 'Observation clinique pour grippe saisonnière.',
      files: ['/uploads/docs/prescription1.pdf'],
      createdAt: '2024-01-15T10:30:00Z',
    };

    expect(record.id).toBe(1);
    expect(record.patientId).toBe(1);
    expect(record.title).toBe('Consultation Générale');
    expect(record.content).toBe('Observation clinique pour grippe saisonnière.');
    expect(record.files).toContain('/uploads/docs/prescription1.pdf');
  });

  it('devrait valider CreateMedicalRecordDto', () => {
    const createDto: CreateMedicalRecordDto = {
      patientId: 1,
      title: 'Consultation Générale',
      content: 'Observation clinique pour grippe saisonnière.',
      files: ['/uploads/docs/prescription1.pdf'],
    };

    expect(createDto.patientId).toBe(1);
    expect(createDto.title).toBe('Consultation Générale');
    expect(createDto.content).toBe('Observation clinique pour grippe saisonnière.');
  });
});

