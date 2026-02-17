/**
 * Composant de routage principal de l'application
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth/useAuth';
import PrivateRoute from '../components/guards/PrivateRoute';
import RoleGuard from '../components/guards/RoleGuard';
import PublicRoute from '../components/guards/PublicRoute';
import { Role } from '../types';
import { publicRoutes, adminRoutes, doctorRoutes, patientRoutes } from './Routes';

export default function AppRouter() {
  const { isAuthenticated, user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        {publicRoutes.map((route: RouteObject) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                {route.element}
              </PublicRoute>
            }
          />
        ))}

        {/* Routes Admin */}
        {adminRoutes.map((route: RouteObject) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <RoleGuard userRole={user?.role} allowedRoles={[Role.ADMIN]}>
                  {route.element}
                </RoleGuard>
              </PrivateRoute>
            }
          />
        ))}

        {/* Routes Doctor */}
        {doctorRoutes.map((route: RouteObject) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <RoleGuard userRole={user?.role} allowedRoles={[Role.DOCTOR, Role.ADMIN]}>
                  {route.element}
                </RoleGuard>
              </PrivateRoute>
            }
          />
        ))}

        {/* Routes Patient */}
        {patientRoutes.map((route: RouteObject) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <RoleGuard userRole={user?.role} allowedRoles={[Role.PATIENT, Role.ADMIN]}>
                  {route.element}
                </RoleGuard>
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
