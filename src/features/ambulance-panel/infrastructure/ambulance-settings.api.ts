import { httpClient, extractData } from '../../../shared/lib/http';
import type { AmbulanceSettings } from '../domain/ambulance-settings.entity';

/**
 * API: Obtener configuración de ambulancia
 * Endpoint: GET /api/ambulances/settings
 */
export const getAmbulanceSettingsAPI = async (): Promise<AmbulanceSettings> => {
  const response = await httpClient.get<{ success: boolean; data: AmbulanceSettings }>(
    '/ambulances/settings'
  );
  return extractData(response);
};

/**
 * API: Actualizar configuración de ambulancia
 * Endpoint: PUT /api/ambulances/settings
 */
export const updateAmbulanceSettingsAPI = async (
  settings: Partial<AmbulanceSettings>
): Promise<AmbulanceSettings> => {
  const response = await httpClient.put<{ success: boolean; data: AmbulanceSettings }>(
    '/ambulances/settings',
    settings
  );
  return extractData(response);
};
