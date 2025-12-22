import type { PharmacyBranch } from '../domain/PharmacyBranch.entity';
import { PharmacyRepository } from '../infrastructure/pharmacy.repository';

const pharmacyRepository = new PharmacyRepository();

/**
 * Caso de uso: Obtener sucursales de una farmacia
 */
export const getPharmacyBranchesUseCase = async (pharmacyId: string): Promise<PharmacyBranch[]> => {
  return await pharmacyRepository.getPharmacyBranches(pharmacyId);
};

