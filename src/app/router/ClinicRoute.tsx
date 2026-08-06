import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { isClinicsProviderType } from "../../shared/lib/normalizeProviderType";

// Módulo de clínicas fuera de uso: se bloquea el acceso al panel sin borrar
// la lógica de verificación de rol/tipo de abajo (queda inalcanzable mientras
// esta constante esté en true — reversible con un solo cambio).
const CLINIC_PANEL_DISABLED = true;

export const ClinicRoute = ({ children }: { children: React.ReactNode }) => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;

  if (CLINIC_PANEL_DISABLED) {
    return <Navigate to="/home" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario es administrador de clínica
  const isClinicAdmin =
    user?.role === "provider" && isClinicsProviderType(user?.tipo);

  if (!isClinicAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
