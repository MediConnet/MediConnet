import { httpClient, extractData } from '../../../shared/lib/http';
import type { ProviderRequest } from '../domain/provider-request.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

/**
 * API: Obtener solicitudes de proveedores
 * Endpoint: GET /api/admin/requests
 */
export const getProviderRequestsAPI = async (params?: {
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  dateFrom?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<ProviderRequest>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("status", params?.status || "all");
  searchParams.set("page", String(params?.page || 1));
  searchParams.set("limit", String(params?.limit || 20));
  if (params?.dateFrom) {
    searchParams.set("dateFrom", params.dateFrom);
  }

  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ProviderRequest> }>(
    `/admin/requests?${searchParams.toString()}`
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
 */
export const getProviderHistoryAPI = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<ProviderRequest>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page || 1));
  searchParams.set("limit", String(params?.limit || 20));
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);

  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ProviderRequest> }>(
    `/admin/history?${searchParams.toString()}`
  );
  return extractData(response);
};