import { httpClient, extractData } from '../../../shared/lib/http';
import type { AmbulanceProfile } from '../domain/ambulance-profile.entity';

/**
 * API: Obtener perfil de ambulancia
 * Endpoint: GET /api/ambulances/profile
 */
export const getAmbulanceProfileAPI = async (): Promise<AmbulanceProfile> => {
  const response = await httpClient.get<{ success: boolean; data: AmbulanceProfile }>(
    '/ambulances/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil de ambulancia
 * Endpoint: PUT /api/ambulances/profile
 */
export const updateAmbulanceProfileAPI = async (
  profile: Partial<AmbulanceProfile>
): Promise<AmbulanceProfile> => {
  const response = await httpClient.put<{ success: boolean; data: AmbulanceProfile }>(
    '/ambulances/profile',
    profile
  );
  return extractData(response);
};
