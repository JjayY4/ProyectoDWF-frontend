import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

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

export default function ListarVuelos() {
  const token = useAuthStore((s) => s.token);
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/flights', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFlights)
      .catch(() => {});
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Vuelos Programados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map((f) => (
          <div key={f.idFlight} className="bg-white rounded-xl shadow-lg p-5">
            <p className="text-lg font-semibold text-gray-800">{f.flightNumber}</p>
            <p className="text-sm text-gray-600">Ruta: {f.routeCode}</p>
            <p className="text-sm text-gray-600">Salida: {new Date(f.departureDateTime).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Llegada: {new Date(f.arrivalDateTime).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Avión: {f.airplaneModel}</p>
            <p className="text-sm text-sky-700 font-medium">Aerolínea: {f.airlineName}</p>
            <p className="text-sm font-semibold">Tarifa: ${f.baseRate}</p>
            <p className="text-sm text-green-600">Estado: {f.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}