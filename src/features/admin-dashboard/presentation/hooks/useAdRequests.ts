import { useQuery } from "@tanstack/react-query";
import { getAdRequestsUseCase } from "../../application/get-ad-requests.usecase";

export const useAdRequests = (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const statusKey = params?.status || 'all';
  const pageKey = params?.page || 1;
  const limitKey = params?.limit || 20;
  const searchKey = params?.search || '';
  const serviceTypeKey = params?.serviceType || '';
  const dateFromKey = params?.dateFrom || '';
  const dateToKey = params?.dateTo || '';

  return useQuery({
    queryKey: ['ad-requests-list', statusKey, pageKey, limitKey, searchKey, serviceTypeKey, dateFromKey, dateToKey],
    queryFn: () => getAdRequestsUseCase(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
