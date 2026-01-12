import { getAdRequestsAPI } from "../infrastructure/ad-requests.api";
import type { AdRequest } from "../domain/ad-request.entity";

export const getAdRequestsUseCase = async (): Promise<AdRequest[]> => {
  return await getAdRequestsAPI();
};

