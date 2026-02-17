import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePharmacies } from '../../../hooks/usePharmacies/usePharmacies';

describe('usePharmacies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner les proprietes initiales', () => {
    const { result } = renderHook(() => usePharmacies());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('devrait avoir les methodes CRUD', () => {
    const { result } = renderHook(() => usePharmacies());
    expect(typeof result.current.getAll).toBe('function');
    expect(typeof result.current.getById).toBe('function');
    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
  });

  it('devrait avoir les methodes specifiques', () => {
    const { result } = renderHook(() => usePharmacies());
    expect(typeof result.current.getMedicines).toBe('function');
  });
});
