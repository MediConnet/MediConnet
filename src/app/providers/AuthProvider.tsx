// NOTE: Provider de autenticación que envuelve la aplicación
// TODO: Agregar lógica de verificación de token cuando se implemente el backend

import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';

interface AuthContextType {
  isAuthenticated: boolean;
  user: ReturnType<typeof useAuthStore>['user'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;

  useEffect(() => {
    // TODO: Agregar lógica de verificación de token
    // NOTE: Validar si el token sigue siendo válido con el backend
    // Por ejemplo, hacer una petición a /auth/verify
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// NOTE: Hook para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

