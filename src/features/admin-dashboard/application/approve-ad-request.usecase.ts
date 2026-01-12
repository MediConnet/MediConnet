import { approveAdRequestAPI } from "../infrastructure/ad-requests.api";

export const approveAdRequestUseCase = async (id: string): Promise<void> => {
  return await approveAdRequestAPI(id);
};

