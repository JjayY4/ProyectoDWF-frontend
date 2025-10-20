import { Link } from 'react-router-dom';
import Banner from "../components/Index/Banner";

export default function Index() {
  return (
    <div className="min-h-screen bg-sky-50">
      <header className="bg-sky-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Explora el Mundo
          </h1>

          <p className="text-lg mb-8">Sistema de Gestión de Boletos Aéreos.
          </p>
            <div className="grid md:grid-cols-2 gap-8">
              <Link
                to="/login"
                className="bg-yellow-400 text-sky-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition inline-block text-center"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-sky-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition inline-block text-center"
              >
                Registrarse
              </Link>
            </div>        </div>
      </header>

      <section>
        <Banner />
      </section>
    </div>
  );
}