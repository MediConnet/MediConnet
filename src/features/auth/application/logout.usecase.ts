import { useAuthStore } from '../../../app/store/auth.store';

/**
 * Caso de uso para cerrar sesión.
 * Actúa como orquestador entre la UI y el Store.
 */
export const logoutUseCase = async (): Promise<void> => {
  
  const { logout } = useAuthStore.getState();

  await logout();
  
  console.log('✅ [USE CASE] Logout completado');
  
  // Aquí se pueden agregar otras operaciones relacionadas con el logout.
  // Ejemplo: Limpiar el carrito de compras, trackear evento en Google Analytics, etc.
  // useCartStore.getState().clearCart();
  // Analytics.track('logout');
};