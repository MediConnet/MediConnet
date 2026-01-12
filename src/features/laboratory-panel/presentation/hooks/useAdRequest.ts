import { useState, useEffect } from "react";
import {
  getAdRequestByProviderUseCase,
  hasActiveAdUseCase,
  hasApprovedAdRequestUseCase,
} from "../../../../features/admin-dashboard/application/get-ad-request-by-provider.usecase";
import { createAdRequestUseCase } from "../../../../features/admin-dashboard/application/create-ad-request.usecase";
import { createAdUseCase } from "../../../../features/admin-dashboard/application/create-ad.usecase";
import type { AdRequest } from "../../../../features/admin-dashboard/domain/ad-request.entity";
import { useAuthStore } from "../../../../app/store/auth.store";

export const useAdRequest = () => {
  const { user } = useAuthStore();
  const [pendingRequest, setPendingRequest] = useState<AdRequest | null>(null);
  const [hasActiveAd, setHasActiveAd] = useState(false);
  const [hasApprovedRequest, setHasApprovedRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [request, activeAd, approvedRequest] = await Promise.all([
        getAdRequestByProviderUseCase(user.id),
        hasActiveAdUseCase(user.id),
        hasApprovedAdRequestUseCase(user.id),
      ]);

      setPendingRequest(request);
      setHasActiveAd(activeAd);
      setHasApprovedRequest(approvedRequest);
    } catch (error) {
      console.error("Error loading ad request status:", error);
      setPendingRequest(null);
      setHasActiveAd(false);
      setHasApprovedRequest(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const createRequest = async (adContent: {
    title: string;
    description: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }) => {
    if (!user) return null;

    try {
      const newRequest = await createAdRequestUseCase(
        user.id,
        user.name || "Usuario",
        user.email,
        user.tipo || "laboratory",
        adContent
      );
      setPendingRequest(newRequest);
      return newRequest;
    } catch (error) {
      console.error("Error creating ad request:", error);
      throw error;
    }
  };

  const createAd = async (adData: {
    title: string;
    description: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }) => {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      await createAdUseCase(user.id, adData);
      setHasActiveAd(true);
      setHasApprovedRequest(false);
      await loadData();
      return true;
    } catch (error) {
      console.error("Error creating ad:", error);
      throw error;
    }
  };

  return {
    pendingRequest,
    hasActiveAd,
    hasApprovedRequest,
    isLoading,
    createRequest,
    createAd,
    refetch: loadData,
  };
};

