import { approveProviderRequestAPI } from "../infrastructure/requests.api";

export const approveRequestUseCase = async (id: string): Promise<void> => {
  return await approveProviderRequestAPI(id);
};

