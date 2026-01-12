import { useState, useEffect } from "react";
import { getAdRequestsUseCase } from "../../application/get-ad-requests.usecase";
import type { AdRequest } from "../../domain/ad-request.entity";

export const useAdRequests = () => {
  const [data, setData] = useState<AdRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const requests = await getAdRequestsUseCase();
        setData(requests);
      } catch (error) {
        console.error("Error loading ad requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const requests = await getAdRequestsUseCase();
      setData(requests);
    } catch (error) {
      console.error("Error loading ad requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, refetch };
};

