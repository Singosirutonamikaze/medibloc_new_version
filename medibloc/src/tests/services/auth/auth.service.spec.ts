import { describe, it, expect, vi } from 'vitest';
import { authService } from '../../../services/api/auth/auth.service';

/**
 * Tests pour le service d'authentification
 * Verifie les methodes de login, register et logout
 */
describe('Auth Service', () => {
  it('devrait avoir les methodes requises', () => {
    expect(typeof authService.login).toBe('function');
    expect(typeof authService.register).toBe('function');
    expect(typeof authService.logout).toBe('function');
    expect(typeof authService.refreshToken).toBe('function');
  });

  it('devrait etre un objet avec les proprietes correctes', () => {
    expect(authService).toBeDefined();
    expect(Object.keys(authService).length).toBeGreaterThan(0);
  });

  it('devrait avoir une methode login', async () => {
    vi.mock('../../../utils/api/apiClient');
    expect(typeof authService.login).toBe('function');
  });

  it('devrait avoir une methode register', async () => {
    expect(typeof authService.register).toBe('function');
  });

  it('devrait avoir une methode logout', async () => {
    expect(typeof authService.logout).toBe('function');
  });

  it('devrait avoir une methode refreshToken', async () => {
    expect(typeof authService.refreshToken).toBe('function');
  });
});
