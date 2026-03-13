import { httpClient, extractData } from '../../../shared/lib/http';
import type { DashboardStats } from '../domain/dashboard-stats.entity';
import type { AdminSettings } from '../domain/admin-settings.entity';

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

/**
 * API: Obtener configuración de administración
 * Endpoint: GET /api/admin/settings
 */
export const getAdminSettingsAPI = async (): Promise<AdminSettings> => {
  const response = await httpClient.get<{ success: boolean; data: AdminSettings }>(
    '/admin/settings'
  );
  return extractData(response);
};

/**
 * API: Actualizar configuración de administración
 * Endpoint: PUT /api/admin/settings
 */
export const updateAdminSettingsAPI = async (settings: Partial<AdminSettings>): Promise<AdminSettings> => {
  const response = await httpClient.put<{ success: boolean; data: AdminSettings }>(
    '/admin/settings',
    settings
  );
  return extractData(response);
};
