import { httpClient } from '../../../shared/lib/http';

export interface SearchParams {
  query?: string;
  specialty?: string;
  location?: string;
  type?: 'doctor' | 'ambulance';
  minRating?: number;
  availableNow?: boolean;
}

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

export const searchProvidersAPI = async (
  params: SearchParams
): Promise<Provider[]> => {
  const response = await httpClient.get<Provider[]>('/search/providers', {
    params,
  });
  return response.data;
};





