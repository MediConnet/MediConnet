import { getProviderRequestsAPI } from "../infrastructure/requests.api";

export const getRequestsUseCase = async (params?: {
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  dateFrom?: string;
  page?: number;
  limit?: number;
}) => {
  return await getProviderRequestsAPI(params);
};