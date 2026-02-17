import { describe, it, expect } from 'vitest';
import { medicinesService } from '../../../services/api/medicines/medicines.service';

describe('Medicines Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof medicinesService.getAll).toBe('function');
    expect(typeof medicinesService.getById).toBe('function');
    expect(typeof medicinesService.create).toBe('function');
    expect(typeof medicinesService.update).toBe('function');
    expect(typeof medicinesService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques medicines', () => {
    expect(typeof medicinesService.getByPharmacy).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(medicinesService).toBeDefined();
  });
});
