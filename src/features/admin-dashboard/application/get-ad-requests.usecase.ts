import { getAdRequestsAPI } from "../infrastructure/ad-requests.api";
import type { PaginatedResponse } from "../../../shared/types/pagination";
import type { AdRequest } from "../domain/ad-request.entity";

export const getAdRequestsUseCase = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PaginatedResponse<AdRequest>> => {
  return await getAdRequestsAPI(params);
};
