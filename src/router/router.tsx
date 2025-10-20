import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Login from '../pages/forms/login';
import Register from '../pages/forms/register';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import Index from '../pages/Index';
import IndexLogged from '../pages/IndexLogued';
import Reserva from '../pages/reserves/reserve';
import type { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
};
function IndexChooser() {
  const token = useAuthStore((s) => s.token);
  return token ? <IndexLogged /> : <Index />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexChooser/>
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/reserva', element: <Reserva /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <Navigate to="/" replace/> },
]);