import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface Airplane {
  idAirplane: number;
  model: string;
  type: string;
  totalCapacity: number;
  description: string;
  airline: {
    name: string;
  };
}

export default function ListarAviones() {
  const token = useAuthStore((s) => s.token);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/airplanes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAirplanes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleDelete = (id: number, model: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar el avión "${model}"?`);
    if (!confirmar) return;

    fetch(`http://localhost:8080/api/airplanes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        toast.success('Avión eliminado correctamente');
        setAirplanes(prev => prev.filter(a => a.idAirplane !== id));
      })
      .catch(() => toast.error('No se pudo eliminar el avión'));
  };

  if (loading) return <p className="text-center mt-10">Cargando aviones...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Aviones Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {airplanes.map(a => (
          <div key={a.idAirplane} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-800">{a.model}</p>
              <p className="text-sm text-gray-600">Tipo: {a.type}</p>
              <p className="text-sm text-gray-600">Capacidad: {a.totalCapacity}</p>
              <p className="text-sm text-gray-600">Descripción: {a.description}</p>
              <p className="text-sm text-sky-700 font-medium">Aerolínea: {a.airline.name}</p>
            </div>
            <button
              onClick={() => handleDelete(a.idAirplane, a.model)}
              className="mt-4 text-red-500 hover:text-red-700 transition"
              title="Eliminar avión"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}