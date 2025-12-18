import { useQuery } from '@tanstack/react-query';
import { searchProvidersUseCase, Provider } from '../../application/search-providers.usecase';
import { SearchFiltersVO } from '../../domain/search-filters.vo';

export const useSearch = (filters: SearchFiltersVO) => {
  return useQuery<Provider[]>({
    queryKey: ['search', filters.toParams()],
    queryFn: () => searchProvidersUseCase(filters),
    enabled: !!filters.getQuery() || !!filters.getLocation(),
  });
};





