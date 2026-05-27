import { useState, useEffect } from "react";
import { getAdRequestsUseCase } from "../../application/get-ad-requests.usecase";
import type { AdRequest } from "../../domain/ad-request.entity";

export const useAdRequests = (initialStatus?: string) => {
  const [data, setData] = useState<AdRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (status?: string) => {
    setIsLoading(true);
    try {
      const requests = await getAdRequestsUseCase(status);
      setData(requests);
    } catch (error) {
      console.error("Error loading ad requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(initialStatus);
  }, [initialStatus]);

  const refetch = async (status?: string) => {
    await loadData(status || initialStatus);
  };

  return { data, isLoading, refetch };
};

