import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";

interface Airplane {
  idAirplane: number;
  model: string;
  type: string;
  totalCapacity: number;
  description: string;
  airline: {
    name: string;
  };
}

interface Crew {
  idCrewMember: number;
  name: string;
  nickname: string;
  post: string;
  licenseNumber: string;
  airline: {
    name: string;
  };
}


export default function AvionesTripulacion(){
    const token = useAuthStore((s) => s.token);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/airplanes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAirplanes);

    fetch("http://localhost:8080/api/crew", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCrew);
  }, [token]);
        return(
            <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Aviones y Tripulación</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Aviones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {airplanes.map((a) => (
            <div key={a.idAirplane} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Modelo:</strong> {a.model}</p>
              <p><strong>Tipo:</strong> {a.type}</p>
              <p><strong>Capacidad:</strong> {a.totalCapacity}</p>
              <p><strong>Aerolínea:</strong> {a.airline.name}</p>
            </div>
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Tripulación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crew.map((c) => (
            <div key={c.idCrewMember} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Nombre:</strong> {c.name}</p>
              <p><strong>Apodo:</strong> {c.nickname}</p>
              <p><strong>Cargo:</strong> {c.post}</p>
              <p><strong>Licencia:</strong> {c.licenseNumber}</p>
              <p><strong>Aerolínea:</strong> {c.airline.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
    );
}