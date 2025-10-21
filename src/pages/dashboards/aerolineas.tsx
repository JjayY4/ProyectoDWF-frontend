import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/authStore';

interface AirlineFormData {
  name: string;
  description: string;
  iataCode: string;
  image: File | null;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  iataCode?: string;
  image?: string;
}

export default function Aerolineas() {
  const [formData, setFormData] = useState<AirlineFormData>({
    name: '',
    description: '',
    iataCode: '',
    image: null
  });
  const token = useAuthStore((s) => s.token);         
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la aerolínea es requerido';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede tener más de 100 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length > 255) {
      newErrors.description = 'La descripción no puede tener más de 255 caracteres';
    }

    if (!formData.iataCode.trim()) {
      newErrors.iataCode = 'El código IATA es requerido';
    } else if (!/^[A-Z0-9]{2,3}$/.test(formData.iataCode)) {
      newErrors.iataCode = 'El código IATA debe tener 2 o 3 caracteres alfanuméricos en mayúsculas';
    }

    if (!formData.image) {
      newErrors.image = 'La imagen es requerida';
    } else {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(formData.image.type)) {
        newErrors.image = 'El formato de imagen no es válido. Use JPEG, PNG o WebP';
      }
      if (formData.image.size > 2 * 1024 * 1024) {
        newErrors.image = 'La imagen no puede ser mayor a 2MB';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'iataCode' ? value.toUpperCase() : value
    }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = e => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ---------- subida de imagen ---------- */
  const uploadImageToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    console.log('Enviando imagen...');
    console.log('Token:', token);
    console.log('Archivo:', file.name, file.size, file.type);

    try {
      const response = await fetch('http://localhost:8080/api/airlines/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      console.log('Status:', response.status);
      const text = await response.text();
      console.log('Body:', text);

      if (!response.ok) throw new Error(text || 'Error al subir la imagen');
      return JSON.parse(text).url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('No se pudo subir la imagen al servidor');
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (formData.image) imageUrl = await uploadImageToBackend(formData.image);

      const airlineData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        iataCode: formData.iataCode.trim().toUpperCase(),
        imageUrl
      };

      const response = await fetch('http://localhost:8080/api/airlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(airlineData)
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error('No tienes permisos de administrador para realizar esta acción');
        if (response.status === 401) throw new Error('No estás autenticado. Por favor, inicia sesión nuevamente');
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la aerolínea');
      }

      setMessage({ type: 'success', text: 'Aerolínea creada exitosamente' });

      // reset
      setFormData({ name: '', description: '', iataCode: '', image: null });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error al crear la aerolínea' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Agregar Nueva Aerolínea</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Aerolínea *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ingrese el nombre de la aerolínea"
            maxLength={100}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Imagen de la Aerolínea *</label>
          {imagePreview ? (
            <div className="mb-4">
              <img src={imagePreview} alt="Vista previa" className="max-w-xs max-h-48 object-cover rounded-md mb-2" />
              <button type="button" onClick={removeImage} className="text-sm text-red-600 hover:text-red-800">Eliminar imagen</button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <input ref={fileInputRef} type="file" id="image" name="image" onChange={handleImageChange} accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" />
              <label htmlFor="image" className="cursor-pointer text-blue-600 hover:text-blue-800">Haga clic para seleccionar una imagen</label>
              <p className="text-sm text-gray-500 mt-2">Formatos: JPEG, PNG, WebP (Máx. 2MB)</p>
            </div>
          )}
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ingrese una breve descripción"
            maxLength={255}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{errors.description && <span className="text-red-600">{errors.description}</span>}</span>
            <span>{formData.description.length}/255</span>
          </div>
        </div>
        <div>
          <label htmlFor="iataCode" className="block text-sm font-medium text-gray-700 mb-2">Código IATA *</label>
          <input
            type="text"
            id="iataCode"
            name="iataCode"
            value={formData.iataCode}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.iataCode ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ej: AA, UA, DL"
            maxLength={3}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.iataCode && <p className="mt-1 text-sm text-red-600">{errors.iataCode}</p>}
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          >
            {isSubmitting ? 'Creando Aerolínea...' : 'Crear Aerolínea'}
          </button>
        </div>
      </form>
    </div>
  );
}