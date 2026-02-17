import { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthUser, LoginCredentials, RegisterData } from '../../types';
import { authService, storageService } from '../../services';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = Readonly<{ children: ReactNode }>;

/**
 * Provider pour la gestion de l'authentification
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedToken = storageService.getToken();
    const storedUser = storageService.getUser() as AuthUser;

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setToken(response.token);
    storageService.setToken(response.token);
    storageService.setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    setUser(response.user);
    setToken(response.token);
    storageService.setToken(response.token);
    storageService.setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    storageService.removeToken();
    storageService.removeUser();
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  }), [user, token, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
