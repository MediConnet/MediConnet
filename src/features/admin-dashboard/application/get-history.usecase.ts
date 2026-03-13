import { getProviderHistoryAPI } from '../infrastructure/requests.api';

/**
 * Caso de uso: Obtener historial de solicitudes (aprobadas y rechazadas)
 * Usa el endpoint optimizado GET /api/admin/history
 */
export const getHistoryUseCase = async () => {
  return await getProviderHistoryAPI();
};
