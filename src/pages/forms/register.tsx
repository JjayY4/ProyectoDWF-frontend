import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import toast from 'react-hot-toast';
import type { RegisterRequest } from '../../types/auth';

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

  const validateForm = () => {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.name)) {
      toast.error("El nombre no puede contener números ni caracteres especiales.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Correo electrónico inválido.");
      return false;
    }

    if (form.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    const birth = new Date(form.birthDate);
    const today = new Date();
    if (birth >= today) {
      toast.error("La fecha de nacimiento no puede ser hoy ni una fecha futura.");
      return false;
    }
    if (!/^[A-Z][1-9][0-9][A-Za-z0-9]{5}$/.test(form.passportNumber)) {
      toast.error("Número de pasaporte inválido. Ejemplo: A12BC345");
      return false;
    }
    if (!/^\d{4}-\d{4}$/.test(form.phone)) {
      toast.error("Formato de teléfono inválido. Debe ser 0000-0000.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(form);
      toast.success("Registro exitoso");
      nav('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-sky-100"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-sky-700">Crear cuenta</h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Nombre completo"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            name="birthDate"
            type="date"
            placeholder='date'
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            name="passportNumber"
            placeholder="Pasaporte (ej: A12BC345)"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            name="phone"
            placeholder="Teléfono (0000-0000)"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition font-semibold"
        >
          Registrarse
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-sky-600 hover:underline font-medium">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
