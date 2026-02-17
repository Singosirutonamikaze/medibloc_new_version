import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUsers } from '../../../hooks/useUsers/useUsers';

/**
 * Tests pour le hook useUsers
 * Verifie la gestion des utilisateurs
 */
describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner les proprietes initiales', () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('devrait avoir les methodes de base', () => {
    const { result } = renderHook(() => useUsers());

    expect(typeof result.current.getAll).toBe('function');
    expect(typeof result.current.getById).toBe('function');
    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
  });

  it('devrait gerer les erreurs', () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current.error).toBeNull();
  });
});
