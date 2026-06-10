import { useState, useCallback } from 'react';
import {
  getCitiesAPI,
  createCityAPI,
  updateCityAPI,
  deleteCityAPI,
} from '../../infrastructure/cities.api';
import type { City } from '../../domain/city.entity';

export const useAdminCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadCities = useCallback(async (page: number, pageSize: number, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCitiesAPI({ page, limit: pageSize, search });
      setCities(Array.isArray(result?.data) ? result.data : []);
      setTotal(result?.pagination?.total ?? 0);
    } catch (err: any) {
      console.error('Error loading cities:', err);
      setError(err?.response?.data?.message || 'Error al cargar ciudades');
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCity = async (data: { name: string; state?: string; country?: string }): Promise<City> => {
    setError(null);
    const newCity = await createCityAPI(data);
    return newCity;
  };

  const updateCity = async (id: string, data: { name?: string; state?: string; country?: string }): Promise<City> => {
    setError(null);
    const updatedCity = await updateCityAPI(id, data);
    return updatedCity;
  };

  const deleteCity = async (id: string): Promise<void> => {
    setError(null);
    await deleteCityAPI(id);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    cities,
    loading,
    error,
    total,
    loadCities,
    createCity,
    updateCity,
    deleteCity,
    clearError,
  };
};
