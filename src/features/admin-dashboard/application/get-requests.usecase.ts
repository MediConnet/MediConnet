import { getProviderRequestsAPI } from "../infrastructure/requests.api";

export const getRequestsUseCase = async (params?: {
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
  serviceType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) => {
  return await getProviderRequestsAPI(params);
};