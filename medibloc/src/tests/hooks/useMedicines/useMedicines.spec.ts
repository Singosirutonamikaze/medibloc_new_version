import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMedicines } from '../../../hooks/useMedicines/useMedicines';

describe('useMedicines', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner les proprietes initiales', () => {
    const { result } = renderHook(() => useMedicines());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('devrait avoir les methodes CRUD', () => {
    const { result } = renderHook(() => useMedicines());
    expect(typeof result.current.getAll).toBe('function');
    expect(typeof result.current.getById).toBe('function');
    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
  });

  it('devrait avoir les methodes specifiques', () => {
    const { result } = renderHook(() => useMedicines());
    expect(typeof result.current.getByPharmacy).toBe('function');
  });
});
