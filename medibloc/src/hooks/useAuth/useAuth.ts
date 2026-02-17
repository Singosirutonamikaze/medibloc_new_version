import { useCallback, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';
import type { AuthUser, LoginCredentials, RegisterData } from '../../types/auth/auth.types';
import { authService } from '../../services/api/auth/auth.service';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await request(() => authService.login(credentials));
    },
    [request]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      await request(() => authService.register(data));
    },
    [request]
  );

  const logout = useCallback(
    async () => {
      await request(() => authService.logout());
    },
    [request]
  );

  const refreshToken = useCallback(
    async () => {
      await request(() => authService.refreshToken());
    },
    [request]
  );

  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };
}
