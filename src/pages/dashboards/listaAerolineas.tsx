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
  const [error, setError] = useState<string | null>(null);

  const fetchAirlines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando fetch de aerolíneas...');
      
      const response = await fetch('http://localhost:8080/api/airlines', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Primero obtener el texto para debuggear
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}\nResponse: ${responseText}`);
      }

      // Intentar parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.error('Raw response:', responseText);
        throw new Error('Respuesta del servidor no es JSON válido');
      }

      console.log('Datos parseados:', data);
      setAirlines(data);
      
    } catch (err) {
      console.error('Error fetching airlines:', err);
      const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar las aerolíneas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, [token]);

  const handleDelete = async (id: number, name: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar la aerolínea "${name}"?`);
    if (!confirmar) {
      toast.error('Eliminación cancelada');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/airlines/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      toast.success('Aerolínea eliminada correctamente');
      setAirlines(prev => prev.filter(a => a.idAirline !== id));
    } catch (err) {
      console.error('Error deleting airline:', err);
      const errorMessage = err instanceof Error ? err.message : 'No se pudo eliminar la aerolínea';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Aerolíneas Disponibles</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Cargando aerolíneas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Aerolíneas Disponibles</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error al cargar aerolíneas</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchAirlines}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Reintentar carga
          </button>
        </div>
      </div>
    );
  }

  if (airlines.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Aerolíneas Disponibles</h1>
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-2">No hay aerolíneas registradas</p>
          <p className="text-gray-500 text-sm">Agrega la primera aerolínea usando el formulario de creación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Aerolíneas Disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {airlines.map(airline => (
          <div key={airline.idAirline} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={airline.imageUrl || 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Airline'}
                alt={airline.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Airline';
                }}
              />
              <button
                onClick={() => handleDelete(airline.idAirline, airline.name)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-700 p-1.5 rounded-full transition-all shadow-sm"
                title="Eliminar aerolínea"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{airline.name}</h2>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {airline.description || 'Sin descripción'}
              </p>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-sky-700 font-medium bg-sky-50 px-2 py-1 rounded">
                  IATA: {airline.iataCode}
                </span>
                <span className="text-xs text-gray-400">ID: {airline.idAirline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Total de aerolíneas: {airlines.length}</p>
      </div>
    </div>
  );
}