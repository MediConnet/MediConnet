// NOTE: Guard de ruta que verifica que el usuario sea un proveedor de insumos médicos
// Solo permite acceso a usuarios autenticados con role 'provider' (o 'patient' legacy) y tipo 'supplies'

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface SupplyRouteProps {
  children: React.ReactNode;
}

export const SupplyRoute = ({ children }: SupplyRouteProps) => {
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
  const isSupplyType = user?.tipo === "supplies";

  if (!user || !hasValidRole || !isSupplyType) {
    // Si no es proveedor de insumos, redirige a home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

