import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { SupplyStore } from '../domain/SupplyStore.entity';
import { SupplyRepository } from '../infrastructure/supply.repository';

const supplyRepository = new SupplyRepository();

export const getSuppliesUseCase = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<SupplyStore>> => {
  return await supplyRepository.getSupplies(params);
};

