import { rejectAdRequestAPI } from "../infrastructure/ad-requests.api";

export const rejectAdRequestUseCase = async (
  id: string,
  reason: string
): Promise<void> => {
  return await rejectAdRequestAPI(id, reason);
};

