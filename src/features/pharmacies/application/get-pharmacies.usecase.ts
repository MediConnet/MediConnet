import type { Pharmacy } from '../domain/Pharmacy.entity';
import { PharmacyRepository } from '../infrastructure/pharmacy.repository';

const pharmacyRepository = new PharmacyRepository();

/**
 * Caso de uso: Obtener lista de farmacias
 */
export const getPharmaciesUseCase = async (): Promise<Pharmacy[]> => {
  return await pharmacyRepository.getPharmacies();
};

