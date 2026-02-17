import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { Role } from '../../types';

type RoleGuardProps = Readonly<{
  children: ReactNode;
  userRole?: Role;
  allowedRoles: Role[]
}>;

/**
 * Composant de protection des routes par rôle
 * Redirige vers /unauthorized si le rôle n'est pas autorisé
 */
export default function RoleGuard({ children, userRole, allowedRoles }: RoleGuardProps) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
