import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function AgregarRuta() {
  const token = useAuthStore((s) => s.token);
  const [form, setForm] = useState({
    originCity: '',
    originAirport: '',
    destinationCity: '',
    destinationAirport: '',
    distanceKm: 0,
    estimatedDuration: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:8080/api/routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    alert('Ruta creada');
    setForm({
      originCity: '',
      originAirport: '',
      destinationCity: '',
      destinationAirport: '',
      distanceKm: 0,
      estimatedDuration: 0,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear Ruta</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input name="originCity" placeholder="Ciudad origen" value={form.originCity} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        <input name="originAirport" placeholder="Aeropuerto origen (IATA)" value={form.originAirport} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        <input name="destinationCity" placeholder="Ciudad destino" value={form.destinationCity} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        <input name="destinationAirport" placeholder="Aeropuerto destino (IATA)" value={form.destinationAirport} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        <input name="distanceKm" type="number" placeholder="Distancia (km)" value={form.distanceKm} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        <input name="estimatedDuration" type="number" step="0.1" placeholder="Duración estimada (h)" value={form.estimatedDuration} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Guardar Ruta</button>
      </form>
    </div>
  );
}