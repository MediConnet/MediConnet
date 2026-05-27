import { useState, useEffect } from 'react';
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

  const loadSpecialties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSpecialtiesAPI();
      setSpecialties(data);
    } catch (err: any) {
      console.error('Error loading specialties:', err);
      setError(err?.response?.data?.message || 'Error al cargar especialidades');
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  };

  const createSpecialty = async (data: { name: string; description?: string; color_hex?: string }): Promise<Specialty> => {
    try {
      setError(null);
      const newSpecialty = await createSpecialtyAPI(data);
      await loadSpecialties();
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
      await loadSpecialties();
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
      await loadSpecialties();
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Error al eliminar la especialidad';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  const clearError = () => {
    setError(null);
  };

  return {
    specialties,
    loading,
    error,
    loadSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    clearError,
  };
};
