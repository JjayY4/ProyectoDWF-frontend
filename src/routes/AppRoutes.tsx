import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Login from '../pages/forms/login';
import Register from '../pages/forms/register';
import Dashboard from '../pages/dashboards/DashboardPassengers';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import Index from '../pages/Index';
import type { JSX } from 'react';

function Protected({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
}
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <Protected>
            <AdminDashboard />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}