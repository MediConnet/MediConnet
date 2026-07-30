// NOTE: Guard de ruta que verifica que el usuario sea un centro estético
// Mismo criterio que DoctorRoute: autenticado, con role válido y tipo "aesthetic"

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { normalizeProviderType } from "../../shared/lib/normalizeProviderType";

interface AestheticRouteProps {
  children: React.ReactNode;
}

export const AestheticRoute = ({ children }: AestheticRouteProps) => {
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
  const isAestheticType = normalizeProviderType(user?.tipo) === "aesthetic";

  if (!user || !hasValidRole || !isAestheticType) {
    // Si no cumple las condiciones, redirige a home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
