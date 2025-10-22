import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface Route {
  idRoute: number;
  originCity: string;
  originAirport: string;
  destinationCity: string;
  destinationAirport: string;
  code: string;
  distanceKm: number;
  estimatedDuration: number;
}

export default function ListarRutas() {
  const token = useAuthStore((s) => s.token);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/routes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleDelete = (id: number, code: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar la ruta ${code}?`);
    if (!confirmar) return;

    fetch(`http://localhost:8080/api/routes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        toast.success('Ruta eliminada correctamente');
        setRoutes((prev) => prev.filter((r) => r.idRoute !== id));
      })
      .catch(() => toast.error('No se pudo eliminar la ruta'));
  };

  if (loading) return <p className="text-center mt-10">Cargando rutas...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Rutas Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((r) => (
          <div key={r.idRoute} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-800">{r.code}</p>
              <p className="text-sm text-gray-600">
                {r.originCity} ({r.originAirport}) → {r.destinationCity} ({r.destinationAirport})
              </p>
              <p className="text-sm text-gray-600">Distancia: {r.distanceKm} km</p>
              <p className="text-sm text-gray-600">Duración: {r.estimatedDuration} h</p>
            </div>
            <button
              onClick={() => handleDelete(r.idRoute, r.code)}
              className="mt-4 text-red-500 hover:text-red-700 transition"
              title="Eliminar ruta"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}