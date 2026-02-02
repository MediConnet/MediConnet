import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export const ClinicRoute = ({ children }: { children: React.ReactNode }) => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario es administrador de clínica
  const isClinicAdmin = user?.role === "provider" && user?.tipo === "clinic";

  if (!isClinicAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
