import { useQuery } from "@tanstack/react-query";
import { getHistoryUseCase } from "../../application/get-history.usecase";

export const useHistoryRequests = (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: [
      'provider-history-list',
      params?.status || '',
      params?.page || 1,
      params?.limit || 20,
      params?.search || '',
      params?.serviceType || '',
      params?.dateFrom || '',
      params?.dateTo || '',
    ],
    queryFn: () => getHistoryUseCase(params),
    staleTime: 1000 * 60 * 5,
  });
};
