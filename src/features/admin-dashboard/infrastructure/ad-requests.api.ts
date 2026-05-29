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
 * 
 * ✅ CORRECCIÓN: Manejo robusto de respuestas paginadas
 */
export const getAdRequestsAPI = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<AdRequest>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params?.page || 1));
    searchParams.set("limit", String(params?.limit || 20));
    
    // ✅ Solo agregar status si está definido (no filtrar automáticamente)
    if (params?.status && params.status !== 'all') {
      searchParams.set("status", params.status);
    }

    console.log('🔍 getAdRequestsAPI - Params:', { params, searchParams: searchParams.toString() });

    const response = await httpClient.get<{ success: boolean; data: any }>(
      `/admin/ad-requests?${searchParams.toString()}`
    );
    
    console.log('🔍 getAdRequestsAPI - Response:', response);
    
    const extractedData = extractData(response);
    console.log('🔍 getAdRequestsAPI - Extracted data:', extractedData);
    
    // ✅ Validar estructura de respuesta
    let data: AdRequest[] = [];
    let pagination = {
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20,
      totalPages: 0,
    };
    
    // Caso 1: Respuesta con estructura { data: [], pagination: {} }
    if (extractedData && typeof extractedData === 'object') {
      if (Array.isArray(extractedData.data)) {
        data = extractedData.data.map(mapAdRequest);
        pagination = extractedData.pagination || pagination;
      }
      // Caso 2: Respuesta directa como array
      else if (Array.isArray(extractedData)) {
        data = extractedData.map(mapAdRequest);
        pagination.total = data.length;
        pagination.totalPages = Math.ceil(data.length / pagination.limit);
      }
    }
    
    console.log('✅ getAdRequestsAPI - Final result:', { data: data.length, pagination });
    
    return { data, pagination };
  } catch (error) {
    console.error('❌ getAdRequestsAPI - Error:', error);
    // Retornar estructura vacía en caso de error
    return {
      data: [],
      pagination: {
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: 0,
      },
    };
  }
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
