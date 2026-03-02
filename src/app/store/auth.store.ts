import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { env } from '../config/env';
import { logger } from '../../shared/lib/logger';

// 1. Definición de Tipos
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tipo?: string | null;
  providerId?: string | null;
}

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Acciones
  login: (user: User, token: string) => void;
  // Cambiamos a Promise<void> porque ahora hace una petición de red
  logout: () => Promise<void>; 
  updateUser: (userData: Partial<User>) => void;
}

// Asegurar que API_URL siempre termine en /api
const API_URL = env.API_URL.endsWith('/api') 
  ? env.API_URL 
  : `${env.API_URL.replace(/\/$/, '')}/api`;

// Creación del Store con Persistencia
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      user: null,
      token: null,
      isAuthenticated: false,

      // --- Acciones ---
      
      login: (user, token) => {
        // 1. Actualizamos el estado de Zustand
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });

        // 2. Compatibilidad Legacy
        try {
          localStorage.setItem('accessToken', token);
        } catch (e) {
          console.error("Error saving legacy tokens", e);
        }
      },

      logout: async () => {
        // 1. Intentar avisar al Backend (Fire & Forget)
        // Obtenemos el token ANTES de borrar el estado
        const token = get().token;

        if (token) {
          try {
            // Usamos fetch nativo para evitar dependencias circulares con axios/httpClient
            await fetch(`${API_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            logger.log('✅ [STORE] Sesión revocada en el servidor');
          } catch (error) {
            // Si falla (ej: servidor caído), no importa, seguimos borrando lo local
            logger.warn('⚠️ [STORE] No se pudo notificar al servidor (logout offline):', error);
          }
        }

        // 2. Limpiamos estado de Zustand (UI Update)
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });

        // 3. Limpieza Legacy
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth-token'); 
        localStorage.removeItem('token');      
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);