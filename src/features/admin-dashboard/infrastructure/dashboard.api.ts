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
  console.log("🌐 getAdminSettingsAPI: Haciendo GET /admin/settings");
  const response = await httpClient.get<{ success: boolean; data: AdminSettings }>(
    '/admin/settings'
  );
  console.log("🌐 getAdminSettingsAPI: Respuesta recibida:", response);
  const data = extractData(response);
  console.log("🌐 getAdminSettingsAPI: Datos extraídos:", data);
  return data;
};

/**
 * API: Actualizar configuración de administración
 * Endpoint: PUT /api/admin/settings
 */
export const updateAdminSettingsAPI = async (settings: Partial<AdminSettings>): Promise<AdminSettings> => {
  console.log("🌐 updateAdminSettingsAPI: Haciendo PUT /admin/settings con:", settings);
  const response = await httpClient.put<{ success: boolean; data: AdminSettings }>(
    '/admin/settings',
    settings
  );
  console.log("🌐 updateAdminSettingsAPI: Respuesta recibida:", response);
  const data = extractData(response);
  console.log("🌐 updateAdminSettingsAPI: Datos extraídos:", data);
  return data;
};
