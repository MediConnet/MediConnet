import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { SupplyStore } from '../domain/SupplyStore.entity';
import type { Review } from '../domain/Review.entity';

export interface SupplyProfile {
  id: string;
  name: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;
  schedule: string;
  logoUrl?: string | null;
  profile_picture_url?: string | null;
  imageUrl?: string | null;
  preview_images?: string[];
  isActive: boolean;
}

/**
 * API: Obtener lista de tiendas de insumos
 * Endpoint: GET /api/supplies
 */
export const getSuppliesAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<SupplyStore>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<SupplyStore> }>(
    '/supplies',
    { params }
  );
  return extractData(response);
};

/**
 * API: Obtener detalle de una tienda de insumos
 * Endpoint: GET /api/supplies/:id
 */
export const getSupplyAPI = async (id: string): Promise<SupplyStore> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyStore }>(
    `/supplies/${id}`
  );
  return extractData(response);
};

/**
 * API: Obtener reseñas de una tienda de insumos (vista pública)
 * Endpoint: GET /api/supplies/:id/reviews
 */
export const getSupplyReviewsAPI = async (
  supplyStoreId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Review>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<Review> }>(
    `/supplies/${supplyStoreId}/reviews`,
    { params }
  );
  return extractData(response);
};

/**
 * API: Obtener reseñas del panel de insumos (proveedor autenticado)
 * Endpoint: GET /api/supplies/reviews
 * Requiere: Bearer token
 */
export const getSupplyPanelReviewsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Review> & { reviews?: Review[]; averageRating: number; totalReviews: number }> => {
  const response = await httpClient.get<{
    success: boolean;
    data: {
      reviews: any[];
      averageRating: number;
      totalReviews: number;
      pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }>('/supplies/reviews', { params });
  const raw = extractData(response);
  const mappedReviews = (raw.reviews || []).map((r: any): Review => ({
    id: r.id,
    userId: r.userId ?? r.patientId ?? r.patient?.id ?? '',
    rating: r.rating ?? 0,
    comment: r.comment ?? '',
    userName: r.userName ?? r.patientName ?? r.patient?.fullName ?? 'Usuario',
    createdAt: r.createdAt ?? r.date ?? new Date().toISOString(),
  }));
  return {
    data: mappedReviews,
    reviews: mappedReviews,
    averageRating: raw.averageRating ?? 0,
    totalReviews: raw.totalReviews ?? 0,
    pagination: {
      total: raw.pagination?.total ?? raw.totalReviews ?? 0,
      page: raw.pagination?.page ?? params?.page ?? 1,
      limit: raw.pagination?.limit ?? params?.limit ?? 20,
      totalPages: raw.pagination?.totalPages ?? 1,
    },
  };
};

/**
 * API: Crear una reseña
 * Endpoint: POST /api/supplies/:id/reviews
 */
export const createReviewAPI = async (params: { supplyStoreId: string; rating: number; comment?: string }): Promise<Review> => {
  const response = await httpClient.post<{ success: boolean; data: Review }>(
    `/supplies/${params.supplyStoreId}/reviews`,
    { rating: params.rating, comment: params.comment }
  );
  return extractData(response);
};

/**
 * API: Obtener perfil del proveedor de insumos (panel autenticado)
 * Endpoint: GET /api/supplies/profile
 * Requiere: Bearer token
 */
export const getSupplyProfileAPI = async (): Promise<SupplyProfile> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyProfile }>(
    '/supplies/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil del proveedor de insumos (panel autenticado)
 * Endpoint: PUT /api/supplies/profile
 * Requiere: Bearer token
 */
export const updateSupplyProfileAPI = async (
  profile: Partial<SupplyProfile>
): Promise<SupplyProfile> => {
  const response = await httpClient.put<{ success: boolean; data: SupplyProfile }>(
    '/supplies/profile',
    profile
  );
  return extractData(response);
};
