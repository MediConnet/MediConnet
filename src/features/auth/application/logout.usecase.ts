// NOTE: Caso de uso para cerrar sesión
// TODO: Agregar llamada al backend para invalidar token si es necesario

import { useAuthStore } from '../../../app/store/auth.store';

/**
 * Caso de uso para cerrar sesión
 * Limpia el estado de autenticación y redirige al login
 */
export const logoutUseCase = () => {
  const authStore = useAuthStore();
  
  // NOTE: Limpiar estado de autenticación
  authStore.logout();
  
  // TODO: Si hay un token en el servidor, hacer una llamada para invalidarlo
  // await logoutAPI();
};

