import { RoleGuard } from '../../guard/RoleGuard';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <RoleGuard roles={['PASSENGER']}>
      <div className="p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de pasajero</h1>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Cerrar sesión
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}