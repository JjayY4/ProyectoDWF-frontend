import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/authStore';

interface CrewFormData {
  idAirline: number;
  name: string;
  nickname: string;
  post: string;
  licenseNumber: string;
}

interface ValidationErrors {
  idAirline?: string;
  name?: string;
  nickname?: string;
  post?: string;
  licenseNumber?: string;
}

export default function AgregarTripulacion() {
  const token = useAuthStore((s) => s.token);
  const [formData, setFormData] = useState<CrewFormData>({
    idAirline: 0,
    name: '',
    nickname: '',
    post: '',
    licenseNumber: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.idAirline || formData.idAirline <= 0) newErrors.idAirline = 'Seleccione una aerolínea';
    if (!formData.name.trim() || formData.name.length > 50) newErrors.name = 'Nombre requerido (máx. 50 caracteres)';
    if (!formData.nickname.trim() || formData.nickname.length > 50) newErrors.nickname = 'Apodo requerido (máx. 50 caracteres)';
    if (!formData.post.trim() || formData.post.length > 30) newErrors.post = 'Cargo requerido (máx. 30 caracteres)';
    if (!formData.licenseNumber.trim() || formData.licenseNumber.length > 20) newErrors.licenseNumber = 'Licencia requerida (máx. 20 caracteres)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/api/crew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al crear tripulación');

      setMessage({ type: 'success', text: 'Tripulación creada exitosamente' });
      setFormData({ idAirline: 0, name: '', nickname: '', post: '', licenseNumber: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear tripulación' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Agregar Tripulación</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aerolínea *</label>
          <select name="idAirline" value={formData.idAirline} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md ${errors.idAirline ? 'border-red-500' : 'border-gray-300'}`}>
            <option value={0}>Seleccione una aerolínea</option>
          </select>
          {errors.idAirline && <p className="text-sm text-red-600">{errors.idAirline}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={50} className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Apodo *</label>
          <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} maxLength={50} className={`w-full px-3 py-2 border rounded-md ${errors.nickname ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nickname && <p className="text-sm text-red-600">{errors.nickname}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cargo *</label>
          <input type="text" name="post" value={formData.post} onChange={handleChange} maxLength={30} className={`w-full px-3 py-2 border rounded-md ${errors.post ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.post && <p className="text-sm text-red-600">{errors.post}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de Licencia *</label>
          <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} maxLength={20} className={`w-full px-3 py-2 border rounded-md ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.licenseNumber && <p className="text-sm text-red-600">{errors.licenseNumber}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 text-white rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {isSubmitting ? 'Creando Tripulación...' : 'Crear Tripulación'}
        </button>
      </form>
    </div>
  );
}