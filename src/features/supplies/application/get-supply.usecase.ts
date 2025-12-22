import type { SupplyStore } from '../domain/SupplyStore.entity';
import { SupplyRepository } from '../infrastructure/supply.repository';

const supplyRepository = new SupplyRepository();

/**
 * Caso de uso: Obtener detalle de una tienda de insumos
 */
export const getSupplyUseCase = async (id: string): Promise<SupplyStore> => {
  return await supplyRepository.getSupply(id);
};

