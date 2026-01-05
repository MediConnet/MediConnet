import { useEffect, useState } from "react";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";
import { getLaboratoryDashboardUseCase } from "../../application/get-laboratory-dashboard.usecase";
import { useAuthStore } from "../../../../app/store/auth.store";

export const useLaboratoryDashboard = () => {
  const [data, setData] = useState<LaboratoryDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const authStore = useAuthStore();
  const { user } = authStore;

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getLaboratoryDashboardUseCase(user.id)
        .then((r) => {
          setData(r);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading laboratory dashboard:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const refetch = () => {
    if (user?.id) {
      setLoading(true);
      getLaboratoryDashboardUseCase(user.id)
        .then((r) => {
          setData(r);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading laboratory dashboard:', err);
          setLoading(false);
        });
    }
  };

  return { data, loading, refetch, setData };
};
