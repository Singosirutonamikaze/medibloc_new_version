import { useCallback, useState } from 'react';
import { pharmaciesService } from '../../services';
import type { CreatePharmacyDto, UpdatePharmacyDto, PaginationParams } from '../../types';

export function usePharmacies() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAll = useCallback(
    (params?: PaginationParams) => request(() => pharmaciesService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => pharmaciesService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreatePharmacyDto) => request(() => pharmaciesService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdatePharmacyDto) => request(() => pharmaciesService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => pharmaciesService.delete(id)),
    [request]
  );

  const getByCountry = useCallback(
    (countryId: number) => request(() => pharmaciesService.getByCountry(countryId)),
    [request]
  );

  const getMedicines = useCallback(
    (id: number) => request(() => pharmaciesService.getMedicines(id)),
    [request]
  );

  return {
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
    getByCountry,
    getMedicines,
  };
}
