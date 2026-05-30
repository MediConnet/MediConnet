import { httpClient, extractData } from '../../../shared/lib/http';
import type { AdRequest } from '../domain/ad-request.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';

/** Normaliza los campos del backend a camelCase con fallbacks seguros */
const mapAdRequest = (raw: any): AdRequest => ({
  id: raw?.id || '',
  providerId: raw?.providerId || raw?.provider_id || '',
  providerName: raw?.providerName || raw?.provider_name || 'Sin nombre',
  providerEmail: raw?.providerEmail || raw?.provider_email || '',
  serviceType: (raw?.serviceType || raw?.service_type || 'doctor') as AdRequest['serviceType'],
  submissionDate: raw?.submissionDate || raw?.submission_date || '',
  status: (raw?.status || 'PENDING') as AdRequest['status'],
  rejectionReason: raw?.rejectionReason || raw?.rejection_reason || undefined,
  approvedAt: raw?.approvedAt || raw?.approved_at || undefined,
  rejectedAt: raw?.rejectedAt || raw?.rejected_at || undefined,
  hasActiveAd: raw?.hasActiveAd ?? raw?.has_active_ad ?? false,
  adContent: raw?.adContent || raw?.ad_content
    ? {
        label: raw?.adContent?.label || raw?.ad_content?.label || '',
        discount: raw?.adContent?.discount || raw?.ad_content?.discount || '',
        description: raw?.adContent?.description || raw?.ad_content?.description || '',
        buttonText: raw?.adContent?.buttonText || raw?.ad_content?.button_text || '',
        imageUrl: raw?.adContent?.imageUrl || raw?.ad_content?.image_url || undefined,
        startDate: raw?.adContent?.startDate || raw?.ad_content?.start_date || '',
        endDate: raw?.adContent?.endDate || raw?.ad_content?.end_date || undefined,
        title: raw?.adContent?.title || raw?.ad_content?.title || undefined,
      }
    : undefined,
});

/**
 * API: Obtener solicitudes de anuncios
 * Endpoint: GET /api/admin/ad-requests
 */
export const getAdRequestsAPI = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PaginatedResponse<AdRequest>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params?.page || 1));
    searchParams.set("limit", String(params?.limit || 20));

    if (params?.status && params.status !== 'all') {
      searchParams.set("status", params.status);
    }

    if (params?.search) {
      searchParams.set("search", params.search);
    }

    if (params?.serviceType) {
      searchParams.set("serviceType", params.serviceType);
    }

    if (params?.dateFrom) {
      searchParams.set("dateFrom", params.dateFrom);
    }

    if (params?.dateTo) {
      searchParams.set("dateTo", params.dateTo);
    }

    console.log('🔍 getAdRequestsAPI - Params:', { params, queryString: searchParams.toString() });

    const response = await httpClient.get<{ success: boolean; data: any }>(
      `/admin/ad-requests?${searchParams.toString()}`
    );

    console.log('🔍 getAdRequestsAPI - Response status:', response.status);
    console.log('🔍 getAdRequestsAPI - Response data keys:', Object.keys(response.data || {}));

    const extractedData = extractData(response);
    console.log('🔍 getAdRequestsAPI - Extracted data type:', typeof extractedData, Array.isArray(extractedData) ? 'array' : 'object');

    let data: AdRequest[] = [];
    let pagination = {
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20,
      totalPages: 0,
    };

    if (extractedData && typeof extractedData === 'object') {
      if (Array.isArray(extractedData.data)) {
        console.log('🔍 getAdRequestsAPI - extractedData.data length:', extractedData.data.length);
        data = extractedData.data.map(mapAdRequest);
        pagination = extractedData.pagination || pagination;
      } else if (Array.isArray(extractedData)) {
        console.log('🔍 getAdRequestsAPI - extractedData is array, length:', extractedData.length);
        data = extractedData.map(mapAdRequest);
        pagination.total = data.length;
        pagination.totalPages = Math.ceil(data.length / pagination.limit);
      } else {
        console.warn('⚠️ getAdRequestsAPI - extractedData.data no es un array:', extractedData);
      }
    }

    console.log('✅ getAdRequestsAPI - Final result:', { dataLength: data.length, total: pagination.total, page: pagination.page });

    return { data, pagination };
  } catch (error) {
    console.error('❌ getAdRequestsAPI - Error:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: 0,
      },
    };
  }
};

export const approveAdRequestAPI = async (id: string): Promise<void> => {
  await httpClient.put<{ success: boolean }>(`/admin/ad-requests/${id}/approve`);
};

export const rejectAdRequestAPI = async (
  id: string,
  reason: string
): Promise<void> => {
  await httpClient.put<{ success: boolean }>(`/admin/ad-requests/${id}/reject`, { reason });
};
