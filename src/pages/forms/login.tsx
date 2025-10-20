import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import type { LoginRequest } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const loginStore = useAuthStore((s) => s.login);
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form);
      loginStore(res.token, res.rol);
      nav(res.rol === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      alert(err.response?.data || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <button className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700">
          Entrar
        </button>
      </form>
    </div>
  );
}