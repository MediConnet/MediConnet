import { useQuery } from '@tanstack/react-query';
import { httpClient, extractData } from '../../../shared/lib/http';

export interface PublicAmbulancesFilters {
  q?: string;
  city?: string; // Backend usa 'city' no 'cityId'
  page?: number;
  limit?: number;
}

export interface PublicAmbulance {
  id: string;
  name: string;
  company?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  isAvailable24h?: boolean;
  services?: string[];
  rating?: number;
  totalReviews?: number;
  logoUrl?: string;
}

export interface PublicAmbulancesResponse {
  ambulances: PublicAmbulance[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Respuesta del backend (usa 'pagination')
interface BackendAmbulancesResponse {
  ambulances: PublicAmbulance[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Hook: Obtener lista de ambulancias públicas (búsqueda)
 */
export const usePublicAmbulances = (filters?: PublicAmbulancesFilters) => {
  return useQuery<PublicAmbulancesResponse>({
    queryKey: ['public', 'ambulances', filters],
    queryFn: async () => {
      const response = await httpClient.get<{ success: boolean; data: BackendAmbulancesResponse }>(
        '/public/ambulances',
        { params: filters }
      );
      const data = extractData(response);
      // Normalizar pagination a meta
      return {
        ambulances: data.ambulances || [],
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
 * Hook: Obtener detalle de una ambulancia pública
 */
export const usePublicAmbulance = (ambulanceId: string | null) => {
  return useQuery<PublicAmbulance>({
    queryKey: ['public', 'ambulances', ambulanceId],
    queryFn: async () => {
      if (!ambulanceId) throw new Error('Ambulance ID is required');
      const response = await httpClient.get<{ success: boolean; data: PublicAmbulance }>(
        `/public/ambulances/${ambulanceId}`
      );
      return extractData(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!ambulanceId,
  });
};
