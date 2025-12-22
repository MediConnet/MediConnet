import type { SupplyStore } from '../domain/SupplyStore.entity';
import { SupplyRepository } from '../infrastructure/supply.repository';

const supplyRepository = new SupplyRepository();

/**
 * Caso de uso: Obtener lista de tiendas de insumos
 */
export const getSuppliesUseCase = async (): Promise<SupplyStore[]> => {
  return await supplyRepository.getSupplies();
};

