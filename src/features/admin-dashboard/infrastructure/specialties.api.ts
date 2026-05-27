import { httpClient, extractData } from '../../../shared/lib/http';
import type { Specialty } from '../domain/specialty.entity';

export const getSpecialtiesAPI = async (): Promise<Specialty[]> => {
  const response = await httpClient.get<{ success: boolean; data: Specialty[] }>(
    '/admin/specialties'
  );
  return extractData(response);
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
