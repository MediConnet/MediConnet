import { useState, useEffect, useCallback } from 'react';
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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const loadChains = useCallback(async (p: number, ps: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPharmacyChainsAPI({ page: p, limit: ps });
      setChains(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      console.error('Error loading pharmacy chains:', err);
      setError(err?.response?.data?.message || 'Error al cargar las cadenas de farmacias');
      setChains([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createChain = async (
    data: Omit<PharmacyChain, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PharmacyChain> => {
    try {
      setError(null);
      const newChain = await createPharmacyChainAPI(data);
      await loadChains(page, pageSize);
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
      await loadChains(page, pageSize);
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
      await loadChains(page, pageSize);
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        'Error al eliminar la cadena';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadChains(page, pageSize);
  }, [page, pageSize, loadChains]);

  const clearError = () => {
    setError(null);
  };

  return {
    chains,
    loading,
    error,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    loadChains,
    createChain,
    updateChain,
    deleteChain,
    clearError,
  };
};
