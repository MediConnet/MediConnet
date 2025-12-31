import { useEffect, useState } from "react";
import type { SupplyDashboard } from "../../domain/SupplyDashboard.entity";
import { getSupplyDashboardUseCase } from "../../application/get-supply-dashboard.usecase";
import { useAuthStore } from "../../../../app/store/auth.store";

export const useSupplyDashboard = () => {
  const [data, setData] = useState<SupplyDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const authStore = useAuthStore();
  const { user } = authStore;

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getSupplyDashboardUseCase(user.id)
        .then((r) => {
          setData(r);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading supply dashboard:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const refetch = () => {
    if (user?.id) {
      setLoading(true);
      getSupplyDashboardUseCase(user.id)
        .then((r) => {
          setData(r);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading supply dashboard:', err);
          setLoading(false);
        });
    }
  };

  return { data, loading, refetch, setData };
};

