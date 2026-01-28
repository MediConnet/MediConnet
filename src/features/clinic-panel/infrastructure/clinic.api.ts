import { httpClient, extractData } from '../../../shared/lib/http';
import type { ClinicProfile, ClinicDashboard } from '../domain/clinic.entity';

/**
 * API: Obtener perfil de la clínica
 * Endpoint: GET /api/clinics/profile
 */
export const getClinicProfileAPI = async (): Promise<ClinicProfile> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicProfile }>(
    '/clinics/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil de la clínica
 * Endpoint: PUT /api/clinics/profile
 */
export const updateClinicProfileAPI = async (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
  const response = await httpClient.put<{ success: boolean; data: ClinicProfile }>(
    '/clinics/profile',
    profile
  );
  return extractData(response);
};

/**
 * API: Subir logo de la clínica
 * Endpoint: POST /api/clinics/upload-logo
 */
export const uploadClinicLogoAPI = async (logoFile: File): Promise<{ logoUrl: string }> => {
  const formData = new FormData();
  formData.append('logo', logoFile);
  
  const response = await httpClient.post<{ success: boolean; data: { logoUrl: string } }>(
    '/clinics/upload-logo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return extractData(response);
};

/**
 * API: Obtener dashboard de la clínica
 * Endpoint: GET /api/clinics/dashboard
 */
export const getClinicDashboardAPI = async (): Promise<ClinicDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicDashboard }>(
    '/clinics/dashboard'
  );
  return extractData(response);
};
