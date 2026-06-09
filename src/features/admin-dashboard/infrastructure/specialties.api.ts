import { httpClient, extractData } from '../../../shared/lib/http';
import type { Specialty } from '../domain/specialty.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

export const getSpecialtiesAPI = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<Specialty>> => {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.search) queryParams.search = params.search;

  console.log('🔍 getSpecialtiesAPI - Params:', queryParams);

  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<Specialty> }>(
    '/admin/specialties',
    { params: queryParams }
  );

  console.log('🔍 getSpecialtiesAPI - Response:', response);

  const extractedData = extractData(response);
  console.log('🔍 getSpecialtiesAPI - Extracted data:', extractedData);

  const data = Array.isArray(extractedData?.data) ? extractedData.data : [];
  const pagination = extractedData?.pagination ?? {
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 20,
    totalPages: 0,
  };

  console.log('✅ getSpecialtiesAPI - Result:', { dataLength: data.length, total: pagination.total });

  return { data, pagination };
};

export const createSpecialtyAPI = async (
  data: { name: string; description?: string; color_hex?: string }
): Promise<Specialty> => {
  const response = await httpClient.post<{ success: boolean; data: Specialty }>(
    '/admin/specialties',
    data
  );
  return extractData(response);
};

export const updateSpecialtyAPI = async (
  id: string,
  data: { name?: string; description?: string; color_hex?: string }
): Promise<Specialty> => {
  const cleanId = id.split(':')[0].trim();
  const response = await httpClient.put<{ success: boolean; data: Specialty }>(
    `/admin/specialties/${cleanId}`,
    data
  );
  return extractData(response);
};

export const deleteSpecialtyAPI = async (id: string): Promise<void> => {
  const cleanId = id.split(':')[0].trim();
  await httpClient.delete<{ success: boolean }>(`/admin/specialties/${cleanId}`);
};
