import { useEffect, useState } from 'react';
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
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{a.name}</h2>
                <p className="text-gray-600 mb-3 flex-1">{a.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sky-700 font-medium">IATA: {a.iataCode}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}