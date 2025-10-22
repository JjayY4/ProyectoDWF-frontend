import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/authStore';
import useAirlines from '../../hooks/useAirlines';

interface Route {
  idRoute: number;
  code: string;
  originAirport: string;
  destinationAirport: string;
}

interface Airplane {
  idAirplane: number;
  model: string;
}

interface FlightFormData {
  idAirline: number;
  idRoute: number;
  idAirplane: number;
  flightNumber: string;
  departureDateTime: string;
  arrivalDateTime: string;
  baseRate: number;
}

export default function AgregarVuelo() {
  const token = useAuthStore((s) => s.token);
  const airlines = useAirlines();

  const [formData, setFormData] = useState<FlightFormData>({
    idAirline: 0,
    idRoute: 0,
    idAirplane: 0,
    flightNumber: '',
    departureDateTime: '',
    arrivalDateTime: '',
    baseRate: 0,
  });

  const [routes, setRoutes] = useState<Route[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRoutes = () => {
    fetch('http://localhost:8080/api/routes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRoutes)
      .catch(() => {});
  };

  const loadAirplanes = () => {
    fetch('http://localhost:8080/api/airplanes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAirplanes)
      .catch(() => {});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          departureDateTime: new Date(formData.departureDateTime).toISOString(),
          arrivalDateTime: new Date(formData.arrivalDateTime).toISOString(),
          baseRate: Number(formData.baseRate),
        }),
      });

      if (!response.ok) throw new Error('Error al crear vuelo');

      setMessage({ type: 'success', text: 'Vuelo creado exitosamente' });
      setFormData({
        idAirline: 0,
        idRoute: 0,
        idAirplane: 0,
        flightNumber: '',
        departureDateTime: '',
        arrivalDateTime: '',
        baseRate: 0,
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear vuelo' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Crear Nuevo Vuelo</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aerolínea *</label>
          <select name="idAirline" value={formData.idAirline} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
            <option value={0}>Seleccione una aerolínea</option>
            {airlines.map((a) => (
              <option key={a.idAirline} value={a.idAirline}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ruta *</label>
          <select name="idRoute" value={formData.idRoute} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" onFocus={loadRoutes}>
            <option value={0}>Seleccione una ruta</option>
            {routes.map((r) => (
              <option key={r.idRoute} value={r.idRoute}>
                {r.code} - {r.originAirport} → {r.destinationAirport}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Avión *</label>
          <select name="idAirplane" value={formData.idAirplane} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" onFocus={loadAirplanes}>
            <option value={0}>Seleccione un avión</option>
            {airplanes.map((p) => (
              <option key={p.idAirplane} value={p.idAirplane}>{p.model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de vuelo *</label>
          <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="Ej: ABC123" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y hora de salida *</label>
          <input type="datetime-local" name="departureDateTime" value={formData.departureDateTime} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y hora de llegada *</label>
          <input type="datetime-local" name="arrivalDateTime" value={formData.arrivalDateTime} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tarifa base *</label>
          <input type="number" name="baseRate" value={formData.baseRate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" min="0" step="0.01" />
        </div>

        <button type="submit" disabled={submitting} className={`w-full py-3 px-4 text-white rounded-md ${submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {submitting ? 'Creando vuelo...' : 'Crear vuelo'}
        </button>
      </form>
    </div>
  );
}