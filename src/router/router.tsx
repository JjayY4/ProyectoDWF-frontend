// router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Login from '../pages/forms/login';
import Register from '../pages/forms/register';
import AdminLayout from '../pages/dashboards/AdminLayout';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import Index from '../pages/Index';
import IndexLogged from '../pages/IndexLogued';
import Aerolineas from '../pages/dashboards/aerolineas';
import ListarAerolineas from '../pages/dashboards/listaAerolineas';
import Vuelos from '../pages/dashboards/vuelos';
import Reserva from '../pages/reserves/reserve';
import AvionesTripulacion from '../pages/dashboards/aviones-tripulacion';
import Rutas from '../pages/dashboards/Rutas';
import Reclamos from '../pages/dashboards/reclamos';

import type { JSX } from 'react';
import NavMenuAerolineas from '../pages/dashboards/NavMenuAerolineas';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const rol = useAuthStore((s) => s.rol);
  return rol === 'ADMIN' ? children : <Navigate to="/" replace />;
};

function IndexChooser() {
  const token = useAuthStore((s) => s.token);
  return token ? <IndexLogged /> : <Index />;
}

export const router = createBrowserRouter([
  { path: '/', element: <IndexChooser /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/reserva', element: <Reserva /> },
  { path: '/aviones-tripulacion', element: <AvionesTripulacion /> },
  {path: '/rutas', element:<Rutas/>},
  { path: '/reclamos', element: <Reclamos /> },
  {
    path: '/aerolineas',
    element: (
      <AdminRoute>
        <div className="min-h-screen bg-gray-50">
          <NavMenuAerolineas/>
            <Outlet/>
        </div>
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/aerolineas/listar" replace /> },
      { path: 'agregar', element: <Aerolineas /> },
      { path: 'listar', element: <ListarAerolineas /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'aerolineas', element: <Aerolineas /> },
      { path: 'aerolineas/agregar', element: <Aerolineas /> },
      { path: 'vuelos', element: <Vuelos /> },
      { path: 'aviones-tripulacion', element: <AvionesTripulacion /> },
      { path: 'reclamos', element: <Reclamos /> },
      { path: 'rutas', element:<Rutas />}
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);