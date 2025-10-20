import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Login from '../pages/forms/login';
import Register from '../pages/forms/register';
import Dashboard from '../pages/dashboards/DashboardPassengers';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import type { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
};
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);