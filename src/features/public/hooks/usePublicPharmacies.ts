import { useQuery } from '@tanstack/react-query';
import { httpClient, extractData } from '../../../shared/lib/http';

export interface PublicPharmaciesFilters {
  // Solo page y limit por ahora (q, cityId, brandId no están disponibles aún en el backend)
  page?: number;
  limit?: number;
}

export interface PublicPharmacy {
  id: string;
  name: string;
  brand?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  isOpen24h?: boolean;
  schedule?: string;
  rating?: number;
  totalReviews?: number;
  logoUrl?: string;
}

export interface PublicPharmaciesResponse {
  pharmacies: PublicPharmacy[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Respuesta del backend (usa 'pagination')
interface BackendPharmaciesResponse {
  pharmacies: PublicPharmacy[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Hook: Obtener lista de farmacias públicas (búsqueda)
 */
export const usePublicPharmacies = (filters?: PublicPharmaciesFilters) => {
  return useQuery<PublicPharmaciesResponse>({
    queryKey: ['public', 'pharmacies', filters],
    queryFn: async () => {
      const response = await httpClient.get<{ success: boolean; data: BackendPharmaciesResponse }>(
        '/public/pharmacies',
        { params: filters }
      );
      const data = extractData(response);
      // Normalizar pagination a meta
      return {
        pharmacies: data.pharmacies || [],
        meta: data.pagination || data.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: true,
  });
};

/**
 * Hook: Obtener detalle de una farmacia pública
 * Backend usa /public/pharmacies/branches/:id
 */
export const usePublicPharmacy = (pharmacyId: string | null) => {
  return useQuery<PublicPharmacy>({
    queryKey: ['public', 'pharmacies', pharmacyId],
    queryFn: async () => {
      if (!pharmacyId) throw new Error('Pharmacy ID is required');
      // Backend usa /public/pharmacies/branches/:id
      const response = await httpClient.get<{ success: boolean; data: PublicPharmacy }>(
        `/public/pharmacies/branches/${pharmacyId}`
      );
      return extractData(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!pharmacyId,
  });
};
