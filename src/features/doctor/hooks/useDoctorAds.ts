import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../../app/store/auth.store";
import { getMyPaginatedAdsAPI } from "../../../shared/api/ads.api";
import type { Ad } from "../../../shared/domain/Ad.entity";

export const useDoctorAds = () => {
  const { user } = useAuthStore();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await getMyPaginatedAdsAPI({ page, limit });
      setAds(result.data);
      setTotal(result.pagination.total);
    } catch (error: any) {
      console.error("Error cargando anuncios:", error);
      const msg = error?.response?.data?.message || error?.message || "Error desconocido";
      console.error("Detalle del error:", msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ads,
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    refetch: loadData,
  };
};
