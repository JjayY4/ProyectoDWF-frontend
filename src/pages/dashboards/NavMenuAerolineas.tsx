import { Link, useLocation } from 'react-router-dom';

export default function NavMenuAerolineas() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-sky-600 text-white px-6 py-4 flex gap-4">
      <Link
        to="/aerolineas/agregar"
        className={`px-3 py-1 rounded ${isActive('/aerolineas/agregar') ? 'bg-sky-800' : 'hover:bg-sky-700'}`}
      >
        Agregar Aerolínea
      </Link>
      <Link
        to="/aerolineas/listar"
        className={`px-3 py-1 rounded ${isActive('/aerolineas/listar') ? 'bg-sky-800' : 'hover:bg-sky-700'}`}
      >
        Ver Aerolíneas
      </Link>
    </nav>
  );
}