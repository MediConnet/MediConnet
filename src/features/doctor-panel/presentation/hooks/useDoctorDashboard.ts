import { useEffect, useState } from "react";
import type { DoctorDashboard } from "../../domain/DoctorDashboard.entity";
import { getDoctorDashboardUseCase } from "../../application/get-doctor-dashboard.usecase";
import { useAuthStore } from "../../../../app/store/auth.store";

export const useDoctorDashboard = () => {
  const [data, setData] = useState<DoctorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const authStore = useAuthStore();
  const { user } = authStore;

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getDoctorDashboardUseCase(user.id)
        .then((r) => {
          setData(r);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading doctor dashboard:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const refetch = () => {
    if (user?.id) {
      setLoading(true);
      getDoctorDashboardUseCase(user.id)
        .then((r) => {
          setData(r);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading doctor dashboard:', err);
          setLoading(false);
        });
    }
  };

  return { data, loading, refetch, setData };
};
