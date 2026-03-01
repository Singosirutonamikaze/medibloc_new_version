/**
 * Composant de routage principal de l'application
 */
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth/useAuth';
import PrivateRoute from '../components/guards/PrivateRoute';
import RoleGuard from '../components/guards/RoleGuard';
import PublicRoute from '../components/guards/PublicRoute';
import { DashboardLayout } from '../components/layouts';
import { Role } from '../types';
import { publicRoutes, adminRoutes, doctorRoutes, patientRoutes } from './Routes';
import { ROUTES } from '../utils/constants/routes.constants';

function getDashboardPath(role?: string): string {
  if (role === Role.ADMIN) return ROUTES.ADMIN.DASHBOARD;
  if (role === Role.DOCTOR) return ROUTES.DOCTOR.DASHBOARD;
  return ROUTES.PATIENT.DASHBOARD;
}

export default function AppRouter() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = getDashboardPath(user?.role);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        {publicRoutes.map((route: RouteObject) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PublicRoute isAuthenticated={isAuthenticated} redirectTo={dashboardPath}>
                {route.element}
              </PublicRoute>
            }
          />
        ))}

        {/* Routes Admin — layout DashboardLayout partagé */}
        <Route
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <RoleGuard userRole={user?.role} allowedRoles={[Role.ADMIN]}>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </RoleGuard>
            </PrivateRoute>
          }
        >
          {adminRoutes.map((route: RouteObject) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Routes Doctor — layout DashboardLayout partagé */}
        <Route
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <RoleGuard userRole={user?.role} allowedRoles={[Role.DOCTOR, Role.ADMIN]}>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </RoleGuard>
            </PrivateRoute>
          }
        >
          {doctorRoutes.map((route: RouteObject) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Routes Patient — layout DashboardLayout partagé */}
        <Route
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <RoleGuard userRole={user?.role} allowedRoles={[Role.PATIENT, Role.ADMIN]}>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </RoleGuard>
            </PrivateRoute>
          }
        >
          {patientRoutes.map((route: RouteObject) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
