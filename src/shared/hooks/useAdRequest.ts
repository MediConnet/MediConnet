import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../app/store/auth.store";
import { createAdAPI, getMyAdAPI, type CreateAdParams } from "../api/ads.api";
import type { Ad } from "../domain/Ad.entity";

export const useAdRequest = () => {
  const { user } = useAuthStore();
  
  // Estados de la UI
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [pendingRequest, setPendingRequest] = useState<Ad | null>(null);
  
  const [hasActiveAd, setHasActiveAd] = useState(false);
  const [hasApprovedRequest, setHasApprovedRequest] = useState(false); 
  
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getMyAdAPI(); 

      // Resetear estados
      setActiveAd(null);
      setPendingRequest(null);
      setHasActiveAd(false);
      setHasApprovedRequest(false);

      let ad: Ad | null = null;
      
      if (Array.isArray(response)) {
        ad = response[0] || null;
      } else {
        ad = response;
      }

      if (ad) {
        // Validación de estados
        if (ad.status === 'APPROVED' && ad.is_active === true) {
          setActiveAd(ad);
          setHasActiveAd(true);
          setHasApprovedRequest(true); 
        } else if (ad.status === 'PENDING') {
          setPendingRequest(ad);
        }
      }

    } catch (error) {
      console.error("Error loading ad status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createRequest = async (adData: CreateAdParams) => {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      await createAdAPI(adData);
      await loadData();
      return true;
    } catch (error) {
      console.error("Error creating ad request:", error);
      throw error;
    }
  };

  return {
    activeAd,
    pendingRequest,
    hasActiveAd,
    hasApprovedRequest,
    isLoading,
    createRequest,
    refetch: loadData,
  };
};