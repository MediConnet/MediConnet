import { useState, useEffect, useCallback } from 'react';
import {
  getSpecialtiesAPI,
  createSpecialtyAPI,
  updateSpecialtyAPI,
  deleteSpecialtyAPI,
} from '../../infrastructure/specialties.api';
import type { Specialty } from '../../domain/specialty.entity';

export const useAdminSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const loadSpecialties = useCallback(async (p: number, ps: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSpecialtiesAPI({ page: p, limit: ps });
      setSpecialties(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      console.error('Error loading specialties:', err);
      setError(err?.response?.data?.message || 'Error al cargar especialidades');
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSpecialty = async (data: { name: string; description?: string; color_hex?: string }): Promise<Specialty> => {
    try {
      setError(null);
      const newSpecialty = await createSpecialtyAPI(data);
      await loadSpecialties(page, pageSize);
      return newSpecialty;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Error al crear la especialidad';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateSpecialty = async (id: string, data: { name?: string; description?: string; color_hex?: string }): Promise<Specialty> => {
    try {
      setError(null);
      const updatedSpecialty = await updateSpecialtyAPI(id, data);
      await loadSpecialties(page, pageSize);
      return updatedSpecialty;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Error al actualizar la especialidad';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteSpecialty = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteSpecialtyAPI(id);
      await loadSpecialties(page, pageSize);
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Error al eliminar la especialidad';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadSpecialties(page, pageSize);
  }, [page, pageSize, loadSpecialties]);

  const clearError = () => {
    setError(null);
  };

  return {
    specialties,
    loading,
    error,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    loadSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    clearError,
  };
};
