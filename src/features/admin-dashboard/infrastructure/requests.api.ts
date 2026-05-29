import { httpClient, extractData } from '../../../shared/lib/http';
import type { ProviderRequest } from '../domain/provider-request.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

/**
 * API: Obtener solicitudes de proveedores
 * Endpoint: GET /api/admin/requests
 * 
 * ✅ CORRECCIÓN: Manejo robusto de respuestas y sin filtros automáticos
 */
export const getProviderRequestsAPI = async (params?: {
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  dateFrom?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<ProviderRequest>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params?.page || 1));
    searchParams.set("limit", String(params?.limit || 20));
    
    // ✅ Solo agregar status si no es "all"
    if (params?.status && params.status !== "all") {
      searchParams.set("status", params.status);
    }
    
    if (params?.dateFrom) {
      searchParams.set("dateFrom", params.dateFrom);
    }

    console.log('🔍 getProviderRequestsAPI - Params:', { params, searchParams: searchParams.toString() });

    const response = await httpClient.get<{ success: boolean; data: any }>(
      `/admin/requests?${searchParams.toString()}`
    );
    
    console.log('🔍 getProviderRequestsAPI - Response:', response);
    
    const extractedData = extractData(response);
    console.log('🔍 getProviderRequestsAPI - Extracted data:', extractedData);
    
    // ✅ Validar estructura de respuesta
    let data: ProviderRequest[] = [];
    let pagination = {
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20,
      totalPages: 0,
    };
    
    // Caso 1: Respuesta con estructura { data: [], pagination: {} }
    if (extractedData && typeof extractedData === 'object') {
      if (Array.isArray(extractedData.data)) {
        data = extractedData.data;
        pagination = extractedData.pagination || pagination;
      }
      // Caso 2: Respuesta directa como array
      else if (Array.isArray(extractedData)) {
        data = extractedData;
        pagination.total = data.length;
        pagination.totalPages = Math.ceil(data.length / pagination.limit);
      }
      // Caso 3: Respuesta con total
      else if (extractedData.total !== undefined) {
        data = Array.isArray(extractedData.data) ? extractedData.data : [];
        pagination = {
          total: extractedData.total || 0,
          page: extractedData.page || params?.page || 1,
          limit: extractedData.limit || params?.limit || 20,
          totalPages: extractedData.totalPages || Math.ceil((extractedData.total || 0) / (extractedData.limit || params?.limit || 20)),
        };
      }
    }
    
    console.log('✅ getProviderRequestsAPI - Final result:', { data: data.length, pagination });
    
    return { data, pagination };
  } catch (error) {
    console.error('❌ getProviderRequestsAPI - Error:', error);
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
 * 
 * ✅ CORRECCIÓN: Manejo robusto de respuestas y sin filtros automáticos
 */
export const getProviderHistoryAPI = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<ProviderRequest>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params?.page || 1));
    searchParams.set("limit", String(params?.limit || 20));
    
    // ✅ Solo agregar filtros si están definidos
    if (params?.status && params.status !== 'all' && params.status !== '') {
      searchParams.set("status", params.status);
    }
    if (params?.search && params.search.trim() !== '') {
      searchParams.set("search", params.search.trim());
    }

    console.log('🔍 getProviderHistoryAPI - Params:', { params, searchParams: searchParams.toString() });

    const response = await httpClient.get<{ success: boolean; data: any }>(
      `/admin/history?${searchParams.toString()}`
    );
    
    console.log('🔍 getProviderHistoryAPI - Response:', response);
    
    const extractedData = extractData(response);
    console.log('🔍 getProviderHistoryAPI - Extracted data:', extractedData);
    
    // ✅ Validar estructura de respuesta
    let data: ProviderRequest[] = [];
    let pagination = {
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20,
      totalPages: 0,
    };
    
    // Caso 1: Respuesta con estructura { data: [], pagination: {} }
    if (extractedData && typeof extractedData === 'object') {
      if (Array.isArray(extractedData.data)) {
        data = extractedData.data;
        pagination = extractedData.pagination || pagination;
      }
      // Caso 2: Respuesta con estructura { data: [], total, page, limit }
      else if (extractedData.data === undefined && Array.isArray(extractedData)) {
        data = extractedData;
        pagination.total = data.length;
        pagination.totalPages = Math.ceil(data.length / pagination.limit);
      }
      // Caso 3: Respuesta directa con total
      else if (extractedData.total !== undefined) {
        data = Array.isArray(extractedData.data) ? extractedData.data : [];
        pagination = {
          total: extractedData.total || 0,
          page: extractedData.page || params?.page || 1,
          limit: extractedData.limit || params?.limit || 20,
          totalPages: extractedData.totalPages || Math.ceil((extractedData.total || 0) / (extractedData.limit || params?.limit || 20)),
        };
      }
    }
    
    console.log('✅ getProviderHistoryAPI - Final result:', { data: data.length, pagination });
    
    return { data, pagination };
  } catch (error) {
    console.error('❌ getProviderHistoryAPI - Error:', error);
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