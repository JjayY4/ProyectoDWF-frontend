import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import type { LoginRequest } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const loginStore = useAuthStore((s) => s.login);
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await login(form);
      console.log('Respuesta del login:', res);
      
      const userData = {
        id: res.user?.id || Date.now(),
        name: res.user?.name || form.email.split('@')[0],
        email: form.email
      };
      console.log('UserData a guardar:', userData);

      loginStore(res.token, res.rol, userData);
      setTimeout(() => {
          console.log('Store después del login:', useAuthStore.getState());
        }, 100);
      
      nav(res.rol === 'ADMIN' ? '/admin' : '/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>
        
        <div className="mb-4">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            onChange={handleChange}
            value={form.email}
          />
        </div>
        
        <div className="mb-6">
          <input 
            name="password" 
            type="password" 
            placeholder="Contraseña" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            onChange={handleChange}
            value={form.password}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-sky-600 hover:underline font-medium">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
}