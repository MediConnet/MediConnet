// NOTE: Guard de ruta que verifica que el usuario sea un doctor
// Solo permite acceso a usuarios autenticados con role 'provider' (o 'patient' legacy) y tipo 'doctor'

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

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

  const hasValidRole =
    user?.role === "provider" ||
    user?.role === "patient" ||
    user?.role === "profesional";
  const isDoctorType = user?.tipo === "doctor";

  if (!user || !hasValidRole || !isDoctorType) {
    // Si no cumple las condiciones, redirige a home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
