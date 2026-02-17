import { describe, it, expect } from 'vitest';
import { pharmaciesService } from '../../../services/api/pharmacies/pharmacies.service';

describe('Pharmacies Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof pharmaciesService.getAll).toBe('function');
    expect(typeof pharmaciesService.getById).toBe('function');
    expect(typeof pharmaciesService.create).toBe('function');
    expect(typeof pharmaciesService.update).toBe('function');
    expect(typeof pharmaciesService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques pharmacies', () => {
    expect(typeof pharmaciesService.getMedicines).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(pharmaciesService).toBeDefined();
  });
});
