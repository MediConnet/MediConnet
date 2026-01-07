import type { PharmacyBranch } from "../domain/pharmacy-branch.entity";
import { getPharmacyBranchesMock } from "../infrastructure/pharmacy-branches.mock";

export const getPharmacyBranchesUseCase = async (): Promise<PharmacyBranch[]> => {
  // Aquí se podría añadir lógica de negocio si fuera necesario
  return await getPharmacyBranchesMock();
};