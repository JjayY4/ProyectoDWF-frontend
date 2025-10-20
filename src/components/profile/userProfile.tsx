import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

export default function UserProfile({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);
  const handleLogout = () => {
    logout();
    onClose();
    nav('/login');
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-white/30 backdrop-blur-md z-40"
        onClick={onClose}
      />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl pointer-events-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-sky-700">Mi cuenta</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-black text-xl font-bold"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-700 mb-3">
            <strong>Nombre:</strong> {user?.name}
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Correo:</strong> {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}