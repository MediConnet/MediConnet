import type { PharmacyBranch } from '../domain/PharmacyBranch.entity';
import { PharmacyRepository } from '../infrastructure/pharmacy.repository';

const pharmacyRepository = new PharmacyRepository();

/**
 * Caso de uso: Obtener detalle de una sucursal
 */
export const getBranchUseCase = async (branchId: string): Promise<PharmacyBranch> => {
  return await pharmacyRepository.getBranch(branchId);
};

