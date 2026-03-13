import { httpClient, extractData } from '../../../shared/lib/http';
import type { ProviderRequest } from '../domain/provider-request.entity';

/**
 * API: Obtener solicitudes de proveedores
 * Endpoint: GET /api/admin/requests
 */
export const getProviderRequestsAPI = async (): Promise<ProviderRequest[]> => {
  const response = await httpClient.get<{ success: boolean; data: ProviderRequest[] }>(
    '/admin/requests'
  );
  return extractData(response);
};

/**
 * API: Aprobar solicitud de proveedor
 * Endpoint: PUT /api/admin/requests/:id/approve
 */
export const approveProviderRequestAPI = async (id: string): Promise<void> => {
  await httpClient.put<{ success: boolean }>(`/admin/requests/${id}/approve`);
};

/**
 * API: Rechazar solicitud de proveedor
 * Endpoint: PUT /api/admin/requests/:id/reject
 */
export const rejectProviderRequestAPI = async (
  id: string,
  reason: string
): Promise<void> => {
  await httpClient.put<{ success: boolean }>(`/admin/requests/${id}/reject`, { reason });
};

/**
 * API: Obtener historial de solicitudes (aprobadas y rechazadas)
 * Endpoint: GET /api/admin/history
 * Este endpoint devuelve solo solicitudes aprobadas y rechazadas para mejor rendimiento
 */
export const getProviderHistoryAPI = async (): Promise<ProviderRequest[]> => {
  const response = await httpClient.get<{ success: boolean; data: ProviderRequest[] }>(
    '/admin/history'
  );
  return extractData(response);
};