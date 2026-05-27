import { getAdRequestsAPI } from "../infrastructure/ad-requests.api";
import type { AdRequest } from "../domain/ad-request.entity";

export const getAdRequestsUseCase = async (status?: string): Promise<AdRequest[]> => {
  return await getAdRequestsAPI(status);
};

