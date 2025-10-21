import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface Airline {
  idAirline: number;
  name: string;
  description: string;
  iataCode: string;
  imageUrl: string;
}

export default function ListarAerolineas() {
  const token = useAuthStore((s) => s.token);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/airlines', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAirlines(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-center mt-10">Cargando aerolíneas...</p>;
  const handleDelete = (id: number, name: string) => {
  const confirmar = window.confirm(`¿Estás seguro de eliminar la aerolínea "${name}"?`);
  if (!confirmar) {
    toast.error('Eliminación cancelada');
    return;
  }

  fetch(`http://localhost:8080/api/airlines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Aerolínea eliminada correctamente');
      setAirlines(prev => prev.filter(a => a.idAirline !== id));
    })
    .catch(() => toast.error('No se pudo eliminar la aerolínea'));
};

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Aerolíneas Disponibles</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {airlines.map(a => (
            <div key={a.idAirline} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <img
                src={a.imageUrl}
                alt={a.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">{a.name}</h2>
                    <button
                    onClick={() => handleDelete(a.idAirline, a.name)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Eliminar aerolínea"
                    >
                    <Trash2 size={20} />
                    </button>
                </div>
                <p className="text-gray-600 mb-3 flex-1">{a.description}</p>
                <span className="text-sm text-sky-700 font-medium">IATA: {a.iataCode}</span>
                </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}