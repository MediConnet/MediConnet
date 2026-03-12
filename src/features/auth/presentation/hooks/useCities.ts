import { useQuery } from '@tanstack/react-query';
import { getCitiesAPI } from '../../infrastructure/auth.api';
import type { City } from '../../infrastructure/auth.api';

/**
 * Hook: Obtener lista de ciudades (Público)
 * Cache largo porque los datos cambian raramente
 */
export const useCities = () => {
  return useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: getCitiesAPI,
    staleTime: 30 * 60 * 1000, // 30 minutos - datos estáticos
    gcTime: 60 * 60 * 1000, // 1 hora en caché
  });
};
