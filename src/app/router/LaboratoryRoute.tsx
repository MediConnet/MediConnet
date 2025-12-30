// NOTE: Guard de ruta que verifica que el usuario sea un laboratorio
// Solo permite acceso a usuarios autenticados con role 'profesional' y tipo 'lab'

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface LaboratoryRouteProps {
  children: React.ReactNode;
}

export const LaboratoryRoute = ({ children }: LaboratoryRouteProps) => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;
  const location = useLocation();

  // NOTE: Primero verifica autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // NOTE: Verifica que el usuario sea un laboratorio
  if (!user || user.role !== 'patient' || user.tipo !== 'lab') {
    // Si no es laboratorio, redirige a home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

