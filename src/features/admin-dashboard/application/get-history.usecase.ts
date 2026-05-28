import { getProviderHistoryAPI } from '../infrastructure/requests.api';

export const getHistoryUseCase = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return await getProviderHistoryAPI(params);
};
