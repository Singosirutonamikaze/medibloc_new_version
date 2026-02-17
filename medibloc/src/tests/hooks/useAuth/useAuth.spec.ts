import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { renderHookWithAuth } from '../../utils/test-utils';

/**
 * Tests pour le hook useAuth
 * Verifie la gestion de l'authentification utilisateur
 */
describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait lancer une erreur si utilise en dehors du provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow();
  });

  it('devrait retourner les donnees attendues avec le provider', () => {
    const { result } = renderHookWithAuth(useAuth);
    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.login).toBeDefined();
    expect(result.current.register).toBeDefined();
    expect(result.current.logout).toBeDefined();
    expect(result.current.refreshToken).toBeDefined();
  });
});
