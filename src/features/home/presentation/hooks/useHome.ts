import { useQuery } from '@tanstack/react-query';
import { getHomeContentUseCase } from '../../application/get-home-content.usecase';
import { getFeaturesUseCase } from '../../application/get-features.usecase';
import { getFeaturedServicesUseCase } from '../../application/get-featured-services.usecase';
import type { HomeContent } from '../../domain/HomeContent.entity';
import type { Feature } from '../../domain/Feature.entity';
import type { FeaturedService } from '../../domain/FeaturedService.entity';

/**
 * Hook: Obtener contenido principal de la página home
 */
export const useHomeContent = () => {
  return useQuery<HomeContent>({
    queryKey: ['home', 'content'],
    queryFn: () => getHomeContentUseCase(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Obtener características de la plataforma
 */
export const useFeatures = () => {
  return useQuery<Feature[]>({
    queryKey: ['home', 'features'],
    queryFn: () => getFeaturesUseCase(),
    staleTime: 10 * 60 * 1000, // 10 minutos (cambian menos frecuentemente)
  });
};

/**
 * Hook: Obtener servicios destacados
 */
export const useFeaturedServices = () => {
  return useQuery<FeaturedService[]>({
    queryKey: ['home', 'featured-services'],
    queryFn: () => getFeaturedServicesUseCase(),
    staleTime: 1 * 60 * 1000, // 1 minuto (cambian más frecuentemente)
    refetchInterval: 5 * 1000, // Refrescar cada 5 segundos para rotación
  });
};

