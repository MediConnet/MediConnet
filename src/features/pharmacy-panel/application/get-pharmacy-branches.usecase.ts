import type { PharmacyBranch } from "../domain/pharmacy-branch.entity";
import { getPharmacyBranchesAPI } from "../infrastructure/pharmacy.api";

export const getPharmacyBranchesUseCase = async (): Promise<PharmacyBranch[]> => {
  try {
    const data: unknown = await getPharmacyBranchesAPI();
    return Array.isArray(data) ? (data as PharmacyBranch[]) : [];
  } catch (error) {
    // ✅ Importante: NO mostrar mocks aquí. Si falla el backend, devolvemos vacío.
    console.error("Error obteniendo sucursales desde backend:", error);
    return [];
  }
};