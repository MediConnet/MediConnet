import { rejectProviderRequestAPI } from "../infrastructure/requests.api";

export const rejectRequestUseCase = async (
  id: string,
  reason: string
): Promise<void> => {
  return await rejectProviderRequestAPI(id, reason);
};

