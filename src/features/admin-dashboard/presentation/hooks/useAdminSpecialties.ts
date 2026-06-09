import { useState, useCallback } from 'react';
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

  const loadSpecialties = useCallback(async (page: number, pageSize: number, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSpecialtiesAPI({ page, limit: pageSize, search });
      setSpecialties(Array.isArray(result?.data) ? result.data : []);
      setTotal(result?.pagination?.total ?? 0);
    } catch (err: any) {
      console.error('Error loading specialties:', err);
      setError(err?.response?.data?.message || 'Error al cargar especialidades');
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSpecialty = async (data: { name: string; description?: string; color_hex?: string }): Promise<Specialty> => {
    setError(null);
    const newSpecialty = await createSpecialtyAPI(data);
    return newSpecialty;
  };

  const updateSpecialty = async (id: string, data: { name?: string; description?: string; color_hex?: string }): Promise<Specialty> => {
    setError(null);
    const updatedSpecialty = await updateSpecialtyAPI(id, data);
    return updatedSpecialty;
  };

  const deleteSpecialty = async (id: string): Promise<void> => {
    setError(null);
    await deleteSpecialtyAPI(id);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    specialties,
    loading,
    error,
    total,
    loadSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    clearError,
  };
};
