import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  rol: string | null;
  login: (token: string, rol: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        rol: null,
        login: (token, rol) => set({ token, rol }, false, 'login'),
        logout: () => set({ token: null, rol: null }, false, 'logout'),
      }),
      { name: 'auth' }
    )
  )
);