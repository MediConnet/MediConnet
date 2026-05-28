import { useCallback, useEffect, useState } from "react";
import { getMyPaginatedAdsAPI, type MyAdsFilters } from "../api/ads.api";
import type { Ad } from "../domain/Ad.entity";

export const useMyAds = (initialFilters?: MyAdsFilters) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MyAdsFilters>(initialFilters || {});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadData = useCallback(async (overrideFilters?: MyAdsFilters) => {
    setIsLoading(true);
    try {
      const result = await getMyPaginatedAdsAPI({
        page,
        limit,
        ...(overrideFilters || filters),
      });
      setAds(result.data);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error("Error loading ads:", error);
      setAds([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilters = (newFilters: MyAdsFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const refetch = () => loadData();

  return {
    ads,
    isLoading,
    filters,
    updateFilters,
    refetch,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
  };
};
