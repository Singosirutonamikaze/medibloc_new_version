import { describe, it, expect } from 'vitest';
import { usersService } from '../../../services/api/users/users.service';

describe('Users Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof usersService.getAll).toBe('function');
    expect(typeof usersService.getById).toBe('function');
    expect(typeof usersService.create).toBe('function');
    expect(typeof usersService.update).toBe('function');
  });

  it('devrait avoir les methodes specifiques', () => {
    expect(typeof usersService.getProfile).toBe('function');
  });

  it('devrait etre un objet avec proprietes', () => {
    expect(usersService).toBeDefined();
    expect(Object.keys(usersService).length).toBeGreaterThan(0);
  });
});

