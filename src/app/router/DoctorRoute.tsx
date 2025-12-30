// NOTE: Guard de ruta que verifica que el usuario sea un doctor
// Solo permite acceso a usuarios autenticados con role 'profesional' y tipo 'doctor'

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface DoctorRouteProps {
  children: React.ReactNode;
}

export const DoctorRoute = ({ children }: DoctorRouteProps) => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;
  const location = useLocation();

  // NOTE: Primero verifica autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // NOTE: Verifica que el usuario sea un doctor
  if (!user || user.role !== 'patient' || user.tipo !== 'doctor') {
    // Si no es doctor, redirige a home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

