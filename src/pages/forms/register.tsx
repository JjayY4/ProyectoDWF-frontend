import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import type{ RegisterRequest } from '../../types/auth';

export default function Register() {
  const [form, setForm] = useState<RegisterRequest>({
    email: '',
    password: '',
    name: '',
    birthDate: '',
    passportNumber: '',
    phone: '',
  });
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registrado con éxito');
      nav('/login');
    } catch (err: any) {
      alert(err.response?.data || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>
        <input name="name" placeholder="Nombre completo" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="password" type="password" placeholder="Contraseña (mín. 6)" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="birthDate" type="date" placeholder='date' required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="passportNumber" placeholder="Pasaporte" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="phone" placeholder="Teléfono" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <button className="w-full bg-yellow-400 text-sky-900 py-2 rounded hover:bg-yellow-300">Registrarse</button>
      </form>
    </div>
  );
}