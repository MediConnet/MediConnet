import { httpClient, extractData } from '../../../shared/lib/http';
import type { DashboardStats } from '../domain/dashboard-stats.entity';

/**
 * API: Obtener estadísticas del dashboard de administración
 * Endpoint: GET /api/admin/dashboard/stats
 */
export const getDashboardStatsAPI = async (): Promise<DashboardStats> => {
  const response = await httpClient.get<{ success: boolean; data: DashboardStats }>(
    '/admin/dashboard/stats'
  );
  return extractData(response);
};
