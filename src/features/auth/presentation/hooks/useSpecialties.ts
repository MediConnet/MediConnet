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
      // Usar endpoint público que no requiere autenticación
      const response = await httpClient.get<{ success: boolean; data: Specialty[] }>(
        '/public/specialties'
      );
      return extractData(response);
    },
    staleTime: 30 * 60 * 1000, // 30 minutos - datos estáticos
    gcTime: 60 * 60 * 1000, // 1 hora en caché
  });
};
