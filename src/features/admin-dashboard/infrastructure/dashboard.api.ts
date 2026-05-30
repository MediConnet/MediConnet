import { httpClient, extractData } from '../../../shared/lib/http';
import type { DashboardStats } from '../domain/dashboard-stats.entity';
import type { AdminSettings } from '../domain/admin-settings.entity';
import type { ActivityHistory } from '../domain/activity-history.entity';
import type { ActiveService } from '../domain/service-stats.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

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

/**
 * API: Obtener historial de actividad real de la plataforma
 * Endpoint: GET /api/admin/activity
 */
export const getActivityHistoryAPI = async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<ActivityHistory>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ActivityHistory> }>(
    '/admin/activity',
    { params }
  );
  return extractData(response);
};

/**
 * API: Obtener lista de servicios activos aprobados mapeados al frontend
 * Endpoint: GET /api/admin/history?status=APPROVED
 * 
 * ✅ ACTUALIZADO: Ahora soporta paginación y filtros
 */
export const getActiveServicesAPI = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}): Promise<PaginatedResponse<ActiveService>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("status", "APPROVED");
    searchParams.set("page", String(params?.page || 1));
    searchParams.set("limit", String(params?.limit || 10));
    
    // Agregar filtros opcionales
    if (params?.type && params.type !== 'all') {
      searchParams.set("serviceType", params.type);
    }
    if (params?.search && params.search.trim() !== '') {
      searchParams.set("search", params.search.trim());
    }
    
    console.log('🔍 getActiveServicesAPI - Params:', { params, searchParams: searchParams.toString() });

    const response = await httpClient.get<{ success: boolean; data: any }>(
      `/admin/history?${searchParams.toString()}`
    );
    
    console.log('🔍 getActiveServicesAPI - Response:', response);
    
    const extractedData = extractData(response);
    console.log('🔍 getActiveServicesAPI - Extracted data:', extractedData);
    
    // ✅ Validar si extractedData es un array o una respuesta paginada
    let servicesArray: any[] = [];
    let pagination = {
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 0,
    };
    
    if (Array.isArray(extractedData)) {
      // Si es un array directo
      servicesArray = extractedData;
      pagination.total = servicesArray.length;
      pagination.totalPages = Math.ceil(servicesArray.length / pagination.limit);
    } else if (extractedData && typeof extractedData === 'object') {
      // Si es una respuesta paginada con estructura { data: [], total, page, ... }
      if (Array.isArray(extractedData.data)) {
        servicesArray = extractedData.data;
        pagination = {
          total: extractedData.total || extractedData.pagination?.total || servicesArray.length,
          page: extractedData.page || extractedData.pagination?.page || params?.page || 1,
          limit: extractedData.limit || extractedData.pagination?.limit || params?.limit || 10,
          totalPages: extractedData.totalPages || extractedData.pagination?.totalPages || Math.ceil((extractedData.total || servicesArray.length) / (extractedData.limit || params?.limit || 10)),
        };
      } else if (Array.isArray(extractedData.results)) {
        servicesArray = extractedData.results;
        pagination.total = extractedData.total || servicesArray.length;
        pagination.totalPages = Math.ceil(pagination.total / pagination.limit);
      } else {
        console.warn('⚠️ getActiveServicesAPI - Estructura de datos inesperada:', extractedData);
        return { data: [], pagination };
      }
    } else {
      console.warn('⚠️ getActiveServicesAPI - extractedData no es un array ni un objeto:', extractedData);
      return { data: [], pagination };
    }
    
    console.log('🔍 getActiveServicesAPI - Array de servicios:', servicesArray);
    
    // Mapear los datos al formato esperado
    const mappedServices: ActiveService[] = servicesArray.map((item: any) => ({
      id: item.id || item._id || `service-${Math.random()}`,
      name: item.providerName || item.name || 'Sin nombre',
      location: item.city || item.location || 'Sin ubicación',
      type: (item.serviceType || item.type || 'doctor') as "ambulance" | "doctor" | "pharmacy" | "laboratory" | "supplies" | "clinica",
    }));
    
    console.log('✅ getActiveServicesAPI - Final result:', { data: mappedServices.length, pagination });
    
    return {
      data: mappedServices,
      pagination,
    };
  } catch (error) {
    console.error('❌ getActiveServicesAPI - Error:', error);
    // Retornar estructura vacía en caso de error para evitar crashes
    return {
      data: [],
      pagination: {
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0,
      },
    };
  }
};
