import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface Crew {
  idCrewMember: number;
  name: string;
  nickname: string;
  post: string;
  licenseNumber: string;
  airline: {
    name: string;
  };
}

export default function ListarTripulacion() {
  const token = useAuthStore((s) => s.token);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/crew', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCrew(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleDelete = (id: number, name: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar a "${name}"?`);
    if (!confirmar) return;

    fetch(`http://localhost:8080/api/crew/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        toast.success('Tripulante eliminado correctamente');
        setCrew(prev => prev.filter(c => c.idCrewMember !== id));
      })
      .catch(() => toast.error('No se pudo eliminar al tripulante'));
  };

  if (loading) return <p className="text-center mt-10">Cargando tripulación...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tripulación Registrada</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crew.map(c => (
          <div key={c.idCrewMember} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-800">{c.name} ({c.nickname})</p>
              <p className="text-sm text-gray-600">Cargo: {c.post}</p>
              <p className="text-sm text-gray-600">Licencia: {c.licenseNumber}</p>
              <p className="text-sm text-sky-700 font-medium">Aerolínea: {c.airline.name}</p>
            </div>
            <button
              onClick={() => handleDelete(c.idCrewMember, c.name)}
              className="mt-4 text-red-500 hover:text-red-700 transition"
              title="Eliminar tripulante"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}