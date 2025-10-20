import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  rol: string | null;
  user: User | null;
  login: (token: string, rol: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        rol: null,
        user: null,
        login: (token, rol, user) => set({ token, rol, user }),
        logout: () => set({ token: null, rol: null, user: null }),
      }),
      { 
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          rol: state.rol,
          user: state.user
        })
      }
    )
  )
);