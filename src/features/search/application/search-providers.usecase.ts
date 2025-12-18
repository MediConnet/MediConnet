import { SearchFiltersVO } from '../domain/search-filters.vo';
import { searchProvidersAPI } from '../infrastructure/search.api';

export interface Provider {
  id: string;
  name: string;
  type: 'doctor' | 'ambulance';
  specialty?: string;
  rating: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const searchProvidersUseCase = async (
  filters: SearchFiltersVO
): Promise<Provider[]> => {
  const params = filters.toParams();
  return await searchProvidersAPI(params);
};





