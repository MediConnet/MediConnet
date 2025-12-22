import type { Pharmacy } from '../domain/Pharmacy.entity';
import { PharmacyRepository } from '../infrastructure/pharmacy.repository';

const pharmacyRepository = new PharmacyRepository();

/**
 * Caso de uso: Obtener detalle de una farmacia
 */
export const getPharmacyUseCase = async (id: string): Promise<Pharmacy> => {
  return await pharmacyRepository.getPharmacy(id);
};

