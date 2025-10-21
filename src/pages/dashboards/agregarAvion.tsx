import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/authStore';
import useAirlines from '../../hooks/useAirlines';

interface AirplaneFormData {
  idAirline: number;
  model: string;
  type: string;
  totalCapacity: number;
  description: string;
}

interface ValidationErrors {
  idAirline?: string;
  model?: string;
  type?: string;
  totalCapacity?: string;
  description?: string;
}

export default function AgregarAvion() {
  const token = useAuthStore((s) => s.token);
  const [formData, setFormData] = useState<AirplaneFormData>({
    idAirline: 0,
    model: '',
    type: '',
    totalCapacity: 0,
    description: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.idAirline || formData.idAirline <= 0) newErrors.idAirline = 'Seleccione una aerolínea';
    if (!formData.model.trim() || formData.model.length > 50) newErrors.model = 'Modelo requerido (máx. 50 caracteres)';
    if (!formData.type.trim() || formData.type.length > 50) newErrors.type = 'Tipo requerido (máx. 50 caracteres)';
    if (!formData.totalCapacity || formData.totalCapacity <= 0) newErrors.totalCapacity = 'Capacidad debe ser mayor a 0';
    if (!formData.description.trim() || formData.description.length > 50) newErrors.description = 'Descripción requerida (máx. 50 caracteres)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'totalCapacity' ? parseInt(value) : value }));
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
      const response = await fetch('http://localhost:8080/api/airplanes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al crear avión');

      setMessage({ type: 'success', text: 'Avión creado exitosamente' });
      setFormData({ idAirline: 0, model: '', type: '', totalCapacity: 0, description: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear avión' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const airlines = useAirlines();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Agregar Nuevo Avión</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aerolínea *</label>
            <select
                name="idAirline"
                value={formData.idAirline}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.idAirline ? 'border-red-500' : 'border-gray-300'}`}
            >
                <option value={0}>Seleccione una aerolínea</option>
                {airlines.map(a => (
                <option key={a.idAirline} value={a.idAirline}>{a.name}</option>
                ))}
            </select>
            {errors.idAirline && <p className="text-sm text-red-600">{errors.idAirline}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
          <input type="text" name="model" value={formData.model} onChange={handleChange} maxLength={50} className={`w-full px-3 py-2 border rounded-md ${errors.model ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
          <input type="text" name="type" value={formData.type} onChange={handleChange} maxLength={50} className={`w-full px-3 py-2 border rounded-md ${errors.type ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad Total *</label>
          <input type="number" name="totalCapacity" value={formData.totalCapacity} onChange={handleChange} min={1} className={`w-full px-3 py-2 border rounded-md ${errors.totalCapacity ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.totalCapacity && <p className="text-sm text-red-600">{errors.totalCapacity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} maxLength={50} className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 text-white rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {isSubmitting ? 'Creando Avión...' : 'Crear Avión'}
        </button>
      </form>
    </div>
  );
}