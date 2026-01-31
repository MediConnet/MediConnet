import { getActivePharmacyChainsAPI } from '../../features/admin-dashboard/infrastructure/pharmacy-chains.api';
import type { PharmacyChain } from '../../features/admin-dashboard/domain/pharmacy-chain.entity';

/**
 * Obtener cadenas de farmacias activas (para registro y selección)
 * Usa la API pública del backend
 */
export const getPharmacyChains = async (): Promise<PharmacyChain[]> => {
  try {
    return await getActivePharmacyChainsAPI();
  } catch (error) {
    console.error('Error loading pharmacy chains:', error);
    return []; // Retornar array vacío en caso de error
  }
};

