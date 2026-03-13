import { useQuery } from '@tanstack/react-query';
import { httpClient, extractData } from '../../../shared/lib/http';

export interface PublicLaboratoriesFilters {
  q?: string;
  // cityId, page, limit no están disponibles aún en el backend
}

export interface PublicLaboratory {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  schedule?: string;
  services?: string[];
  rating?: number;
  totalReviews?: number;
  logoUrl?: string;
}

export interface PublicLaboratoriesResponse {
  laboratories: PublicLaboratory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Hook: Obtener lista de laboratorios públicos (búsqueda)
 * Backend usa /api/laboratories (no /api/public/laboratories)
 */
export const usePublicLaboratories = (filters?: PublicLaboratoriesFilters) => {
  return useQuery<PublicLaboratoriesResponse>({
    queryKey: ['public', 'laboratories', filters],
    queryFn: async () => {
      // Backend usa /laboratories (sin /public/)
      const response = await httpClient.get<{ success: boolean; data: PublicLaboratory[] }>(
        '/laboratories',
        { params: { q: filters?.q } } // Solo q por ahora
      );
      const data = extractData(response);
      // Backend devuelve array directo, no objeto con laboratories y meta
      const laboratories = Array.isArray(data) ? data : [];
      return {
        laboratories,
        meta: {
          total: laboratories.length,
          page: 1,
          limit: 100,
          totalPages: 1,
        },
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: true,
  });
};

/**
 * Hook: Obtener detalle de un laboratorio público
 * Backend usa /api/laboratories/:id (no /api/public/laboratories/:id)
 */
export const usePublicLaboratory = (laboratoryId: string | null) => {
  return useQuery<PublicLaboratory>({
    queryKey: ['public', 'laboratories', laboratoryId],
    queryFn: async () => {
      if (!laboratoryId) throw new Error('Laboratory ID is required');
      // Backend usa /laboratories/:id (sin /public/)
      const response = await httpClient.get<{ success: boolean; data: PublicLaboratory }>(
        `/laboratories/${laboratoryId}`
      );
      return extractData(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!laboratoryId,
  });
};
