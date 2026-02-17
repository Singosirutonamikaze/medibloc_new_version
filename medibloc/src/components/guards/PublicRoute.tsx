import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type PublicRouteProps = Readonly<{
  children: ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string
}>;

/**
 * Composant pour les routes publiques
 * Redirige les utilisateurs authentifiés vers leur dashboard
 */
export default function PublicRoute({
  children,
  isAuthenticated,
  redirectTo = '/dashboard'
}: PublicRouteProps) {
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
