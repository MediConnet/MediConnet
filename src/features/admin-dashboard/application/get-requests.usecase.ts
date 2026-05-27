import { getProviderRequestsAPI } from "../infrastructure/requests.api";


export const getRequestsUseCase = async (params?: {
  status?: "all" | "PENDING" | "APPROVED" | "REJECTED";
  dateFrom?: string;
}) => {
  return await getProviderRequestsAPI(params);
};