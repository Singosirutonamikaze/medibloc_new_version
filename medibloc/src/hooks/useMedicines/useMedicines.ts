import { useCallback, useState } from 'react';
import { medicinesService } from '../../services';
import type { CreateMedicineDto, UpdateMedicineDto, PaginationParams, MedicineType } from '../../types';

export function useMedicines() {
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
    (params?: PaginationParams & { type?: MedicineType }) => request(() => medicinesService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => medicinesService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreateMedicineDto) => request(() => medicinesService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdateMedicineDto) => request(() => medicinesService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => medicinesService.delete(id)),
    [request]
  );

  const getByType = useCallback(
    (type: MedicineType) => request(() => medicinesService.getByType(type)),
    [request]
  );

  const getByPharmacy = useCallback(
    (pharmacyId: number) => request(() => medicinesService.getByPharmacy(pharmacyId)),
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
    getByType,
    getByPharmacy,
  };
}
