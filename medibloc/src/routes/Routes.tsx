/**
 * Configuration des routes de l'application
 */
import type { RouteObject } from 'react-router-dom';

// Import des pages publiques
import HomePage from '../pages/home';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/auth/register';
import NotFoundPage from '../pages/not-found';

// Import des pages admin
import AdminDashboard from '../pages/[admin]/dashboard';
import AdminUsersPage from '../pages/[admin]/users';
import AdminPatientsPage from '../pages/[admin]/patients';
import AdminDoctorsPage from '../pages/[admin]/doctors';
import AdminAppointmentsPage from '../pages/[admin]/appointments';
import AdminDiseasesPage from '../pages/[admin]/diseases';
import AdminSymptomsPage from '../pages/[admin]/symptoms';
import AdminMedicinesPage from '../pages/[admin]/medicines';
import AdminPharmaciesPage from '../pages/[admin]/pharmacies';
import AdminPrescriptionsPage from '../pages/[admin]/prescriptions';
import AdminMedicalRecordsPage from '../pages/[admin]/medical-records';
import AdminStatsPage from '../pages/[admin]/stats';

// Import des pages doctor
import DoctorDashboard from '../pages/[docteur]/dashboard';
import DoctorPatientsPage from '../pages/[docteur]/patients';
import DoctorAppointmentsPage from '../pages/[docteur]/appointments';
import DoctorPrescriptionsPage from '../pages/[docteur]/prescriptions';
import DoctorMedicalRecordsPage from '../pages/[docteur]/medical-records';

// Import des pages patient
import PatientDashboard from '../pages/[patient]/dashboard';
import PatientProfilePage from '../pages/[patient]/profile';
import PatientAppointmentsPage from '../pages/[patient]/appointments';
import PatientDiseasesPage from '../pages/[patient]/diseases';
import PatientPrescriptionsPage from '../pages/[patient]/prescriptions';
import PatientMedicalRecordsPage from '../pages/[patient]/medical-records';

/**
 * Routes publiques
 */
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

/**
 * Routes admin
 */
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/users',
    element: <AdminUsersPage />,
  },
  {
    path: '/admin/patients',
    element: <AdminPatientsPage />,
  },
  {
    path: '/admin/doctors',
    element: <AdminDoctorsPage />,
  },
  {
    path: '/admin/appointments',
    element: <AdminAppointmentsPage />,
  },
  {
    path: '/admin/diseases',
    element: <AdminDiseasesPage />,
  },
  {
    path: '/admin/symptoms',
    element: <AdminSymptomsPage />,
  },
  {
    path: '/admin/medicines',
    element: <AdminMedicinesPage />,
  },
  {
    path: '/admin/pharmacies',
    element: <AdminPharmaciesPage />,
  },
  {
    path: '/admin/prescriptions',
    element: <AdminPrescriptionsPage />,
  },
  {
    path: '/admin/medical-records',
    element: <AdminMedicalRecordsPage />,
  },
  {
    path: '/admin/stats',
    element: <AdminStatsPage />,
  },
];

/**
 * Routes docteur
 */
export const doctorRoutes: RouteObject[] = [
  {
    path: '/doctor/dashboard',
    element: <DoctorDashboard />,
  },
  {
    path: '/doctor/patients',
    element: <DoctorPatientsPage />,
  },
  {
    path: '/doctor/appointments',
    element: <DoctorAppointmentsPage />,
  },
  {
    path: '/doctor/prescriptions',
    element: <DoctorPrescriptionsPage />,
  },
  {
    path: '/doctor/medical-records',
    element: <DoctorMedicalRecordsPage />,
  },
];

/**
 * Routes patient
 */
export const patientRoutes: RouteObject[] = [
  {
    path: '/patient/dashboard',
    element: <PatientDashboard />,
  },
  {
    path: '/patient/profile',
    element: <PatientProfilePage />,
  },
  {
    path: '/patient/appointments',
    element: <PatientAppointmentsPage />,
  },
  {
    path: '/patient/diseases',
    element: <PatientDiseasesPage />,
  },
  {
    path: '/patient/prescriptions',
    element: <PatientPrescriptionsPage />,
  },
  {
    path: '/patient/medical-records',
    element: <PatientMedicalRecordsPage />,
  },
];
