import { httpClient, extractData } from '../../../shared/lib/http';
import type { AdRequest } from '../domain/ad-request.entity';

/**
 * API: Obtener solicitudes de anuncios
 * Endpoint: GET /api/admin/ad-requests
 */
export const getAdRequestsAPI = async (): Promise<AdRequest[]> => {
  const response = await httpClient.get<{ success: boolean; data: AdRequest[] }>(
    '/admin/ad-requests'
  );
  return extractData(response);
};

/**
 * API: Aprobar solicitud de anuncio
 * Endpoint: PUT /api/admin/ad-requests/:id/approve
 */
export const approveAdRequestAPI = async (id: string): Promise<void> => {
  await httpClient.put<{ success: boolean }>(`/admin/ad-requests/${id}/approve`);
};

/**
 * API: Rechazar solicitud de anuncio
 * Endpoint: PUT /api/admin/ad-requests/:id/reject
 */
export const rejectAdRequestAPI = async (
  id: string,
  reason: string
): Promise<void> => {
  await httpClient.put<{ success: boolean }>(`/admin/ad-requests/${id}/reject`, { reason });
};
