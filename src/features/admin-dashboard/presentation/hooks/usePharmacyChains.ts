import { useState, useEffect } from 'react';
import {
  getPharmacyChainsAPI,
  createPharmacyChainAPI,
  updatePharmacyChainAPI,
  deletePharmacyChainAPI,
} from '../../infrastructure/pharmacy-chains.api';
import type { PharmacyChain } from '../../domain/pharmacy-chain.entity';

export const usePharmacyChains = () => {
  const [chains, setChains] = useState<PharmacyChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChains = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPharmacyChainsAPI();
      setChains(data);
    } catch (err: any) {
      console.error('Error loading pharmacy chains:', err);
      setError(err?.response?.data?.message || 'Error al cargar las cadenas de farmacias');
      setChains([]);
    } finally {
      setLoading(false);
    }
  };

  const createChain = async (
    data: Omit<PharmacyChain, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PharmacyChain> => {
    try {
      setError(null);
      const newChain = await createPharmacyChainAPI(data);
      await loadChains(); // Recargar lista
      return newChain;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Error al crear la cadena';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateChain = async (
    id: string,
    data: Partial<Omit<PharmacyChain, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PharmacyChain> => {
    try {
      setError(null);
      const updatedChain = await updatePharmacyChainAPI(id, data);
      await loadChains(); // Recargar lista
      return updatedChain;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Error al actualizar la cadena';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteChain = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deletePharmacyChainAPI(id);
      await loadChains(); // Recargar lista
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Error al eliminar la cadena';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadChains();
  }, []);

  const clearError = () => {
    setError(null);
  };

  return {
    chains,
    loading,
    error,
    loadChains,
    createChain,
    updateChain,
    deleteChain,
    clearError,
  };
};
