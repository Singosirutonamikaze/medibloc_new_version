import { useCallback, useState } from 'react';
import { symptomsService } from '../../services';
import type { CreateSymptomDto, UpdateSymptomDto, PaginationParams } from '../../types';

export function useSymptoms() {
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
    (params?: PaginationParams) => request(() => symptomsService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => symptomsService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreateSymptomDto) => request(() => symptomsService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdateSymptomDto) => request(() => symptomsService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => symptomsService.delete(id)),
    [request]
  );

  const getDiseases = useCallback(
    (id: number) => request(() => symptomsService.getDiseases(id)),
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
    getDiseases,
  };
}
