import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = Readonly<{
  children: ReactNode;
  isAuthenticated: boolean
}>;

/**
 * Composant de protection des routes privées
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */
export default function PrivateRoute({ children, isAuthenticated }: PrivateRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
