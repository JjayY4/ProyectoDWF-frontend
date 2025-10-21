import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface Airline {
  idAirline: number;
  name: string;
}

export default function useAirlines() {
  const token = useAuthStore((s) => s.token);
  const [airlines, setAirlines] = useState<Airline[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/airlines', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAirlines)
      .catch(() => {});
  }, [token]);

  return airlines;
}