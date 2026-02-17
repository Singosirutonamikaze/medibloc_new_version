import { describe, it, expect } from 'vitest';
import { symptomsService } from '../../../services/api/symptoms/symptoms.service';

describe('Symptoms Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof symptomsService.getAll).toBe('function');
    expect(typeof symptomsService.getById).toBe('function');
    expect(typeof symptomsService.create).toBe('function');
    expect(typeof symptomsService.update).toBe('function');
    expect(typeof symptomsService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques symptoms', () => {
    expect(typeof symptomsService.getDiseases).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(symptomsService).toBeDefined();
  });
});
