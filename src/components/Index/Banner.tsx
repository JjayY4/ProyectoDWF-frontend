export default function Banner(){
    return(
        <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 text-center mb-12">
            {[
              { title: "Vuelos", desc: "Las mejores tarifas aéreas" },
              { title: "Tours", desc: "Experiencias únicas a destinos únicos" },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-bold text-sky-700 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl shadow-xl text-white text-center p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              ¿Listo para volar?
            </h2>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              ¡Reserva tu vuelo en segundos!
            </p>
            <button className="bg-yellow-400 text-sky-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition transform hover:scale-105">
              ¡Reserva de boletos aquí!
            </button>
          </div>
        </div>
      </section>

    );
    
}