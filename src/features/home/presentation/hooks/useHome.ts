import { useQuery } from '@tanstack/react-query';
import { getFeaturedServicesUseCase } from '../../application/get-featured-services.usecase';
import { getFeaturesUseCase } from '../../application/get-features.usecase';
import { getHomeContentUseCase } from '../../application/get-home-content.usecase';
import { getServiceCategoriesUseCase } from '../../application/get-service-categories.usecase';
import type { Feature } from '../../domain/Feature.entity';
import type { FeaturedService } from '../../domain/FeaturedService.entity';
import type { HomeContent } from '../../domain/HomeContent.entity';
import type { ServiceCategory } from '../../domain/ServiceCategory.entity';

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

/**
 * Hook: Obtener catálogo de servicios (categorías)
 */
export const useServiceCategories = () => {
  return useQuery<ServiceCategory[]>({
    queryKey: ['home', 'service-categories'],
    queryFn: () => getServiceCategoriesUseCase(),
    staleTime: Infinity, // Estos datos casi nunca cambian
  });
};

