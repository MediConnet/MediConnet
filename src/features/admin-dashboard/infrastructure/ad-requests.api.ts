import { httpClient, extractData } from '../../../shared/lib/http';
import type { AdRequest } from '../domain/ad-request.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

/** Normaliza los campos snake_case del backend a camelCase */
const mapAdRequest = (raw: any): AdRequest => ({
  ...raw,
  adContent: raw.adContent ? {
    ...raw.adContent,
    imageUrl: raw.adContent.imageUrl || raw.adContent.image_url || undefined,
    buttonText: raw.adContent.buttonText || raw.adContent.button_text || '',
    startDate: raw.adContent.startDate || raw.adContent.start_date || '',
    endDate: raw.adContent.endDate || raw.adContent.end_date || undefined,
  } : undefined,
});

/**
 * API: Obtener solicitudes de anuncios
 * Endpoint: GET /api/admin/ad-requests
 */
export const getAdRequestsAPI = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<AdRequest>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page || 1));
  searchParams.set("limit", String(params?.limit || 20));
  if (params?.status) searchParams.set("status", params.status);

  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<AdRequest> }>(
    `/admin/ad-requests?${searchParams.toString()}`
  );
  const result = extractData(response);
  return {
    data: result.data.map(mapAdRequest),
    pagination: result.pagination,
  };
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
