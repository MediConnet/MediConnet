import type { ProviderRequest } from "../domain/provider-request.entity";
import { MOCK_REQUESTS } from "./requests.mock";

export const getProviderRequestsAPI = async (): Promise<ProviderRequest[]> => {
  return Promise.resolve(MOCK_REQUESTS);
};

export const approveProviderRequestAPI = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const request = MOCK_REQUESTS.find((r) => r.id === id);
  if (request) {
    request.status = "APPROVED";
  }
};

export const rejectProviderRequestAPI = async (
  id: string,
  reason: string
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const request = MOCK_REQUESTS.find((r) => r.id === id);
  if (request) {
    request.status = "REJECTED";
    request.rejectionReason = reason;
  }
};