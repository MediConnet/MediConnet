import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';

export interface AdminAd {
  id: string;
  badgeText: string;
  title: string;
  subtitle?: string;
  actionText: string;
  imageUrl?: string;
  bgColorHex?: string;
  accentColorHex?: string;
  targetScreen: string;
  targetId?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  priorityOrder: number;
  status: string;
  isAdminAd: boolean;
  providerName: string;
}

export interface CreateAdminAdPayload {
  badge_text: string;
  title: string;
  subtitle?: string;
  action_text: string;
  image_url?: string;
  start_date: string;
  end_date?: string;
  target_screen: string;
  target_id?: string;
  bg_color_hex?: string;
  accent_color_hex?: string;
  priority_order?: number;
}

export const getAdminAdsAPI = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<AdminAd>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page || 1));
  searchParams.set("limit", String(params?.limit || 20));
  const res = await httpClient.get<{ success: boolean; data: PaginatedResponse<AdminAd> }>(
    `/admin/ads?${searchParams.toString()}`
  );
  return extractData(res);
};

export const createAdminAdAPI = async (payload: CreateAdminAdPayload): Promise<AdminAd> => {
  const res = await httpClient.post<{ success: boolean; data: { ad: AdminAd } }>('/admin/ads', payload);
  return extractData(res).ad;
};

export const updateAdminAdAPI = async (id: string, payload: Partial<CreateAdminAdPayload>): Promise<AdminAd> => {
  const res = await httpClient.put<{ success: boolean; data: { ad: AdminAd } }>(`/admin/ads/${id}`, payload);
  return extractData(res).ad;
};

export const deleteAdminAdAPI = async (id: string): Promise<void> => {
  await httpClient.delete(`/admin/ads/${id}`);
};

export const toggleAdminAdAPI = async (id: string): Promise<boolean> => {
  const res = await httpClient.put<{ success: boolean; data: { isActive: boolean } }>(`/admin/ads/${id}/toggle`);
  return extractData(res).isActive;
};
