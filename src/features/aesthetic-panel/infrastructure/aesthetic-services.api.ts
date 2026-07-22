import { httpClient, extractData } from "../../../shared/lib/http";

export interface AestheticServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutos
  is_available: boolean;
  payment_method: string;
  image_url?: string | null;
}

export interface CreateAestheticServiceDTO {
  name: string;
  description?: string;
  price: number;
  duration?: number;
  is_available?: boolean;
}

export interface AestheticServicesResponse {
  data: AestheticServiceItem[];
  total: number;
  page: number;
  limit: number;
}

export const getAestheticServicesAPI = async (
  params?: { page?: number; limit?: number }
): Promise<AestheticServicesResponse> => {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const response = await httpClient.get<{
    success: boolean;
    data: AestheticServiceItem[];
    pagination?: { total: number; page: number; limit: number };
  }>(`/doctors/services?page=${page}&limit=${limit}`);

  const raw = extractData(response);
  const data = Array.isArray(raw) ? raw : (raw as any)?.data || [];
  const pagination = (response.data as any)?.pagination || { total: data.length, page, limit };

  return {
    data,
    total: pagination.total ?? data.length,
    page: pagination.page ?? page,
    limit: pagination.limit ?? limit,
  };
};

export const createAestheticServiceAPI = async (
  dto: CreateAestheticServiceDTO
): Promise<AestheticServiceItem> => {
  const response = await httpClient.post<{ success: boolean; data: AestheticServiceItem }>(
    "/doctors/services",
    dto
  );
  return extractData(response);
};

export const updateAestheticServiceAPI = async (
  id: string,
  dto: Partial<CreateAestheticServiceDTO>
): Promise<AestheticServiceItem> => {
  const response = await httpClient.put<{ success: boolean; data: AestheticServiceItem }>(
    `/doctors/services/${id}`,
    dto
  );
  return extractData(response);
};

export const deleteAestheticServiceAPI = async (id: string): Promise<void> => {
  await httpClient.delete(`/doctors/services/${id}`);
};
