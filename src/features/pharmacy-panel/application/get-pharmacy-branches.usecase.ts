import type { PaginatedResponse } from "../../../shared/types/pagination";
import type { PharmacyBranch } from "../domain/pharmacy-branch.entity";
import { getPharmacyBranchesAPI } from "../infrastructure/pharmacy.api";

export const getPharmacyBranchesUseCase = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<PharmacyBranch>> => {
  return await getPharmacyBranchesAPI(params);
};