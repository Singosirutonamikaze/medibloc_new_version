import { useCallback, useState } from 'react';
import { usersService } from '../../services';
import type { CreateUserDto, UpdateUserDto, PaginationParams } from '../../types';

export function useUsers() {
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
    (params?: PaginationParams & { role?: string }) => request(() => usersService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => usersService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreateUserDto) => request(() => usersService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdateUserDto) => request(() => usersService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => usersService.delete(id)),
    [request]
  );

  const getProfile = useCallback(
    () => request(() => usersService.getProfile()),
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
    getProfile,
  };
}
