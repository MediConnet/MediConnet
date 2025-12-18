// NOTE: Guard de ruta que protege rutas que requieren autenticación
// TODO: Agregar lógica de refresh token si es necesario

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = authStore;
  const location = useLocation();

  // NOTE: Si no está autenticado, redirige a login guardando la ruta original
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

