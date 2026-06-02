import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { isClinicsProviderType } from "../../shared/lib/normalizeProviderType";

export const ClinicRoute = ({ children }: { children: React.ReactNode }) => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;

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
