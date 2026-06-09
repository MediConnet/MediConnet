import { useQuery } from "@tanstack/react-query";
import { getActiveServicesUseCase } from "../../application/get-active-services.usecase";

export const useActiveServices = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}) => {
  const pageKey = params?.page || 1;
  const limitKey = params?.limit || 10;
  const typeKey = params?.type || 'all';
  const searchKey = params?.search || '';
  
  return useQuery({
    queryKey: ['active-services-list', pageKey, limitKey, typeKey, searchKey],
    queryFn: () => getActiveServicesUseCase(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
