import type { Ad } from "../domain/Ad.entity";
import type { PaginatedResponse } from "../types/pagination";
import { httpClient, extractData } from "../lib/http";

export interface CreateAdParams {
  label: string;
  discount: string;
  description: string;
  buttonText: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
}

interface CreateAdPayload {
  badge_text: string;
  discount_title: string; 
  description: string;
  button_text: string;
  image_url?: string | null;
  start_date: string;
  end_date?: string;
}

// ------------------------------------------------------------------
// FUNCIONES DE API
// ------------------------------------------------------------------

/**
 * Crea una nueva solicitud de anuncio.
 * Mapea los datos de CamelCase (Frontend) a SnakeCase (Backend).
 */
export const createAdAPI = async (params: CreateAdParams): Promise<void> => {
  // Enviar imagen tal cual — si es base64, el backend la sube a Cloudinary
  const payload: CreateAdPayload = {
    badge_text: params.label,
    discount_title: params.discount !== undefined && params.discount !== null ? String(params.discount) : "",
    description: params.description,
    button_text: params.buttonText,
    image_url: params.imageUrl || null,
    start_date: params.startDate,
    end_date: params.endDate || undefined,
  };

  // POST: Crear el recurso
  await httpClient.post("/ads", payload);
};

/**
 * Obtiene el último anuncio o solicitud del proveedor actual.
 * Retorna null si no tiene ninguno o si da error 404.
 */
export const getMyAdAPI = async (): Promise<Ad | null> => {
  try {
    
    const response = await httpClient.get<any>("/ads");
    const adData = response.data?.data || response.data;

    return adData;
  } catch (error) {
    console.warn("No se pudo obtener el anuncio activo o no existe:", error);
    return null;
  }
};

export interface MyAdsFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Obtiene el listado completo de anuncios del proveedor actual con filtros.
 */
/**
 * Actualiza un anuncio propio (solo si está en estado PENDING).
 */
export const updateAdAPI = async (
  id: string,
  params: Partial<CreateAdParams>
): Promise<void> => {
  const payload: Record<string, any> = {};
  if (params.label !== undefined) payload.badge_text = params.label;
  if (params.discount !== undefined) payload.discount_title = params.discount !== null ? String(params.discount) : null;
  if (params.description !== undefined) payload.description = params.description;
  if (params.buttonText !== undefined) payload.button_text = params.buttonText;
  if (params.imageUrl !== undefined) payload.image_url = params.imageUrl;
  if (params.startDate !== undefined) payload.start_date = params.startDate;
  if (params.endDate !== undefined) payload.end_date = params.endDate;

  await httpClient.put(`/ads/${id}`, payload);
};

export const getMyPaginatedAdsAPI = async (
  params?: { page?: number; limit?: number; status?: string }
): Promise<PaginatedResponse<Ad>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("mode", "all");
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);

  const response = await httpClient.get<any>(`/ads?${searchParams.toString()}`);
  const raw = extractData<any>(response);

  // Normalize: el backend puede devolver { data: [...], pagination } o un array plano
  if (Array.isArray(raw)) {
    return {
      data: raw,
      pagination: {
        total: raw.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? (raw.length || 10),
        totalPages: Math.ceil(raw.length / (params?.limit ?? (raw.length || 10))),
      },
    };
  }

  return {
    data: raw?.data ?? [],
    pagination: raw?.pagination ?? {
      total: 0,
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      totalPages: 0,
    },
  };
};

export const getMyAdsAPI = async (filters?: MyAdsFilters): Promise<Ad[]> => {
  try {
    const params = new URLSearchParams();
    params.set("mode", "all");
    if (filters?.status) params.set("status", filters.status);
    if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.set("dateTo", filters.dateTo);

    const response = await httpClient.get<any>(`/ads?${params.toString()}`);
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("No se pudieron obtener los anuncios:", error);
    return [];
  }
};