import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import DatosPasajero, { type PassengerData } from './PassengerData';

interface Flight {
  idFlight: number;
  flightNumber: string;
  departureDateTime: string;
  arrivalDateTime: string;
  baseRate: number;
  state: string;
  airlineName: string;
  routeCode: string;
  airplaneModel: string;
}

export default function Reserva() {
  const token = useAuthStore((s) => s.token);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleSearch = async () => {
    if (!origin || !destination || !date) return;
    setLoading(true);

    const url = `http://localhost:8080/api/flights/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&departure=${date}T00:00:00`;

    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      if (!res.ok) {
        const text = await res.text();
        console.error('Error backend:', text);
        setFlights([]);
        return;
      }

      const data: Flight[] = await res.json();
      setFlights(data);
    } catch (err) {
      console.error('Fetch error', err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };
  if (selectedFlight) {
    return (
      <DatosPasajero
        flight={selectedFlight}
        onConfirm={(passenger: PassengerData) => {
          console.log('Vuelo elegido:', selectedFlight);
          console.log('Datos pasajero:', passenger);
          alert('Reserva confirmada (simulación)');
        }}
      />
    );
  }
  return (
    <div className="min-h-screen bg-sky-50 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-700 mb-8 text-center">Busca tu vuelo</h1>

        <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Ciudad origen"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Ciudad destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleSearch}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
          >
            Buscar
          </button>
        </div>

        {loading && <p className="text-center mt-6">Buscando vuelos...</p>}

        {!loading && flights.length === 0 && (
          <p className="text-center mt-6 text-gray-600">No hay vuelos para esos criterios.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {flights.map((f) => (
            <div key={f.idFlight} className="bg-white rounded-xl shadow p-5">
              <p className="text-lg font-semibold text-gray-800">{f.flightNumber}</p>
              <p className="text-sm text-gray-600">Ruta: {f.routeCode}</p>
              <p className="text-sm text-gray-600">Salida: {new Date(f.departureDateTime).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Llegada: {new Date(f.arrivalDateTime).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Avión: {f.airplaneModel}</p>
              <p className="text-sm text-sky-700 font-medium">Aerolínea: {f.airlineName}</p>
              <p className="text-sm font-semibold mt-2">Tarifa: ${f.baseRate}</p>
              <button
                onClick={() => setSelectedFlight(f)}
                className="mt-4 w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}