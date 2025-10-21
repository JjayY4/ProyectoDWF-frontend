import { useState } from 'react';
import AgregarAvion from './agregarAvion';
import AgregarTripulacion from './agregarTripulacion';
import ListarAviones from './listarAviones';
import ListarTripulacion from './listarTripulacion';

export default function AvionesTripulacion() {
  const [view, setView] = useState<'aviones' | 'tripulacion'>('aviones');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Aviones y Tripulación</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('aviones')}
          className={`px-4 py-2 rounded-md ${view === 'aviones' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Aviones
        </button>
        <button
          onClick={() => setView('tripulacion')}
          className={`px-4 py-2 rounded-md ${view === 'tripulacion' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Tripulación
        </button>
      </div>

      {view === 'aviones' ? (
        <>
          <AgregarAvion />
          <ListarAviones />
        </>
      ) : (
        <>
          <AgregarTripulacion />
          <ListarTripulacion />
        </>
      )}
    </div>
  );
}