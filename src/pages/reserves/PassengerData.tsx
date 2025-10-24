import { useState } from 'react';

export interface Flight {
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

export interface PassengerData {
  fullName: string;
  birthDate: string;
  passport: string;
  seatPreference?: string;
}

interface Props {
  flight: Flight;
  onConfirm: (p: PassengerData) => void;
}
export default function DatosPasajero({ flight, onConfirm }: Props) {
  const [form, setForm] = useState<PassengerData>({
    fullName: '',
    birthDate: '',
    passport: '',
    seatPreference: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(form);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Completa tus datos</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Nombre completo"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          name="passport"
          value={form.passport}
          onChange={handleChange}
          placeholder="Número de pasaporte"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <select
          name="seatPreference"
          value={form.seatPreference}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Sin preferencia</option>
          <option value="VENTANA">Ventana</option>
          <option value="PASILLO">Pasillo</option>
          <option value="CENTRAL">Central</option>
        </select>

        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600">Vuelo: <span className="font-semibold">{flight.flightNumber}</span></p>
          <p className="text-sm text-gray-600">Ruta: {flight.routeCode}</p>
          <p className="text-sm text-gray-600">Salida: {new Date(flight.departureDateTime).toLocaleString()}</p>
          <p className="text-sm font-semibold mt-2">Precio total: ${flight.baseRate}</p>
        </div>

        <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700">
          Confirmar reserva
        </button>
      </form>
    </div>
  );
}