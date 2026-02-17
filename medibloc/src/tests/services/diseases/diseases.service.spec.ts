import { describe, it, expect } from 'vitest';
import { diseasesService } from '../../../services/api/diseases/diseases.service';

describe('Diseases Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof diseasesService.getAll).toBe('function');
    expect(typeof diseasesService.getById).toBe('function');
    expect(typeof diseasesService.create).toBe('function');
    expect(typeof diseasesService.update).toBe('function');
    expect(typeof diseasesService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques diseases', () => {
    expect(typeof diseasesService.getSymptoms).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(diseasesService).toBeDefined();
  });
});
