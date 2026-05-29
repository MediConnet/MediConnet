import { useQuery } from '@tanstack/react-query';
import { httpClient, extractData } from '../../../../shared/lib/http';
import type { Specialty } from '../../infrastructure/auth.api';

/**
 * Hook: Obtener lista de especialidades médicas (público)
 * Cache largo porque los datos cambian raramente
 */
export const useSpecialties = () => {
  return useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: async () => {
      const response = await httpClient.get<{ success: boolean; data: any }>(
        '/public/specialties'
      );
      const result = extractData(response);
      // endpoint ahora usa paginatedResponse, extraer array interno
      return result.data ?? result;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
