import { httpClient, extractData } from '../../../shared/lib/http';
import type { City } from '../domain/city.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

export const getCitiesAPI = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<City>> => {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.search) queryParams.search = params.search;

  console.log('🔍 getCitiesAPI - Params:', queryParams);

  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<City> }>(
    '/admin/cities',
    { params: queryParams }
  );

  console.log('🔍 getCitiesAPI - Response:', response);

  const extractedData = extractData(response);
  console.log('🔍 getCitiesAPI - Extracted data:', extractedData);

  const data = Array.isArray(extractedData?.data) ? extractedData.data : [];
  const pagination = extractedData?.pagination ?? {
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 20,
    totalPages: 0,
  };

  console.log('✅ getCitiesAPI - Result:', { dataLength: data.length, total: pagination.total });

  return { data, pagination };
};

export const createCityAPI = async (
  data: { name: string; state?: string; country?: string }
): Promise<City> => {
  const response = await httpClient.post<{ success: boolean; data: City }>(
    '/admin/cities',
    data
  );
  return extractData(response);
};

export const updateCityAPI = async (
  id: string,
  data: { name?: string; state?: string; country?: string }
): Promise<City> => {
  const cleanId = id.split(':')[0].trim();
  const response = await httpClient.put<{ success: boolean; data: City }>(
    `/admin/cities/${cleanId}`,
    data
  );
  return extractData(response);
};

export const deleteCityAPI = async (id: string): Promise<void> => {
  const cleanId = id.split(':')[0].trim();
  await httpClient.delete<{ success: boolean }>(`/admin/cities/${cleanId}`);
};
