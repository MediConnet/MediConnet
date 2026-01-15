import type { PharmacyChain } from "../domain/pharmacy-chain.entity";
import { getPharmacyChains } from "../../../shared/lib/pharmacy-chains";

// Mock data para cadenas de farmacias (wrapper para mantener compatibilidad)
export const getPharmacyChainsMock = (): PharmacyChain[] => {
  return getPharmacyChains();
};

export const savePharmacyChains = (chains: PharmacyChain[]) => {
  localStorage.setItem("pharmacy-chains", JSON.stringify(chains));
};

