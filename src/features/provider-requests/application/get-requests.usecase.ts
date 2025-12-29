import { getProviderRequestsAPI } from "../infrastructure/requests.api";


export const getRequestsUseCase = async () => {
  return await getProviderRequestsAPI();
};