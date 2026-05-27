import { useCallback, useEffect, useState } from "react";
import { getMyAdsAPI, type MyAdsFilters } from "../api/ads.api";
import type { Ad } from "../domain/Ad.entity";

export const useMyAds = (initialFilters?: MyAdsFilters) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MyAdsFilters>(initialFilters || {});

  const loadData = useCallback(async (overrideFilters?: MyAdsFilters) => {
    setIsLoading(true);
    try {
      const result = await getMyAdsAPI(overrideFilters || filters);
      setAds(result);
    } catch (error) {
      console.error("Error loading ads:", error);
      setAds([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilters = (newFilters: MyAdsFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const refetch = () => loadData();

  return {
    ads,
    isLoading,
    filters,
    updateFilters,
    refetch,
  };
};
