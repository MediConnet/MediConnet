import { useState, useEffect, useCallback } from 'react';
import {
  getAdminAdsAPI,
  createAdminAdAPI,
  updateAdminAdAPI,
  deleteAdminAdAPI,
  toggleAdminAdAPI,
  type AdminAd,
  type CreateAdminAdPayload,
} from '../../infrastructure/admin-ads.api';

export const useAdminAds = () => {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminAdsAPI();
      setAds(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar anuncios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createAd = async (payload: CreateAdminAdPayload) => {
    const ad = await createAdminAdAPI(payload);
    setAds((prev) => [ad, ...prev]);
    return ad;
  };

  const updateAd = async (id: string, payload: Partial<CreateAdminAdPayload>) => {
    const ad = await updateAdminAdAPI(id, payload);
    setAds((prev) => prev.map((a) => (a.id === id ? ad : a)));
    return ad;
  };

  const deleteAd = async (id: string) => {
    await deleteAdminAdAPI(id);
    setAds((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAd = async (id: string) => {
    const isActive = await toggleAdminAdAPI(id);
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, isActive } : a)));
  };

  return { ads, isLoading, error, refetch: load, createAd, updateAd, deleteAd, toggleAd };
};
