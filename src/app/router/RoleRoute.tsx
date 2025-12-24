// NOTE: Guard de ruta que verifica el rol del usuario
// TODO: Agregar permisos más granulares si es necesario

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;

  // NOTE: Primero verifica autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // NOTE: Luego verifica que el usuario tenga uno de los roles permitidos
  if (user && !allowedRoles.includes(user.role)) {
    // TODO: Mostrar mensaje de error "No tienes permisos" en lugar de solo redirigir
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

