import { describe, it, expect } from 'vitest';
import { medicalRecordsService } from '../../../services/api/medical-records/medical-records.service';

describe('Medical Records Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof medicalRecordsService.getAll).toBe('function');
    expect(typeof medicalRecordsService.getById).toBe('function');
    expect(typeof medicalRecordsService.create).toBe('function');
    expect(typeof medicalRecordsService.update).toBe('function');
    expect(typeof medicalRecordsService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques medical records', () => {
    expect(typeof medicalRecordsService.getByPatient).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(medicalRecordsService).toBeDefined();
  });
});
