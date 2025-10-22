import { useState } from 'react';
import AgregarRuta from './agregarRuta';
import ListarRutas from './listarRutas';

export default function Rutas() {
  const [view, setView] = useState<'listar' | 'agregar'>('listar');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Rutas</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('listar')}
          className={`px-4 py-2 rounded-md ${view === 'listar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Listar Rutas
        </button>
        <button
          onClick={() => setView('agregar')}
          className={`px-4 py-2 rounded-md ${view === 'agregar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Crear Ruta
        </button>
      </div>

      {view === 'agregar' ? <AgregarRuta /> : <ListarRutas />}
    </div>
  );
}