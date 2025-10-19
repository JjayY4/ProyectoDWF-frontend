import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-sky-50">
      <header className="bg-sky-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Explora el Mundo
          </h1>
          <p className="text-lg mb-8">
            Servicio de agencia de vuelos
          </p>
          <button className="bg-yellow-400 text-sky-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
            Explorar
          </button>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Vuelos", desc: "Las mejores tarifas aéreas" },
            { title: "Tours", desc: "Experiencias únicas" },
          ].map((s) => (
            <div key={s.title} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold text-sky-700 mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-800 text-white text-center py-6">
        © 2025 Proyecto de catedra DWF
      </footer>
    </div>
  );
}
