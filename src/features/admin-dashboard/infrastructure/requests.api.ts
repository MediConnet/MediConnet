import type { ProviderRequest } from "../domain/provider-request.entity";
import { MOCK_REQUESTS } from "./requests.mock";

export const getProviderRequestsAPI = async (): Promise<ProviderRequest[]> => {
  return Promise.resolve(MOCK_REQUESTS);
};