import { useCallback, useState } from 'react';
import { diseasesService } from '../../services';
import type { CreateDiseaseDto, UpdateDiseaseDto, PaginationParams } from '../../types';

export function useDiseases() {
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
    (params?: PaginationParams & { category?: string }) => request(() => diseasesService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => diseasesService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreateDiseaseDto) => request(() => diseasesService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdateDiseaseDto) => request(() => diseasesService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => diseasesService.delete(id)),
    [request]
  );

  const getSymptoms = useCallback(
    (id: number) => request(() => diseasesService.getSymptoms(id)),
    [request]
  );

  const getCountries = useCallback(
    (id: number) => request(() => diseasesService.getCountries(id)),
    [request]
  );

  const addSymptom = useCallback(
    (diseaseId: number, symptomId: number) => request(() => diseasesService.addSymptom(diseaseId, symptomId)),
    [request]
  );

  const removeSymptom = useCallback(
    (diseaseId: number, symptomId: number) => request(() => diseasesService.removeSymptom(diseaseId, symptomId)),
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
    getSymptoms,
    getCountries,
    addSymptom,
    removeSymptom,
  };
}
