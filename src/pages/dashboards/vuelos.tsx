import { useState } from 'react';
import AgregarVuelo from './agregarVuelos';
import ListarVuelos from '../listarVuelos';

export default function Vuelos() {
  const [view, setView] = useState<'agregar' | 'listar'>('listar');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Vuelos</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('listar')}
          className={`px-4 py-2 rounded-md ${view === 'listar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Listar Vuelos
        </button>
        <button
          onClick={() => setView('agregar')}
          className={`px-4 py-2 rounded-md ${view === 'agregar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Crear Vuelo
        </button>
      </div>

      {view === 'agregar' ? <AgregarVuelo /> : <ListarVuelos />}
    </div>
  );
}