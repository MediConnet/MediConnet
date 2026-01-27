import { useEffect, useState } from "react";
import type { DoctorDashboard, ProfileStatus, PaymentMethod } from "../../domain/DoctorDashboard.entity";
import { getDoctorDashboardUseCase } from "../../application/get-doctor-dashboard.usecase";
import { useAuthStore } from "../../../../app/store/auth.store";

export const useDoctorDashboard = () => {
  const [data, setData] = useState<DoctorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const authStore = useAuthStore();
  const { user } = authStore;

  // Función para crear datos por defecto para usuarios nuevos
  const getDefaultData = (): DoctorDashboard => ({
    visits: 0,
    contacts: 0,
    reviews: 0,
    rating: 0,
    doctor: {
      name: user?.name || "Dr. Usuario",
      specialty: "Médico",
      email: user?.email || "",
      whatsapp: "",
      address: "",
      price: 0,
      description: "",
      isActive: true,
      profileStatus: 'draft' as ProfileStatus,
      paymentMethods: 'both' as PaymentMethod,
    },
  });

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
          // En caso de error, usar datos por defecto para que el usuario pueda ver las pantallas vacías
          setData(getDefaultData());
          setLoading(false);
        });
    } else {
      // Si no hay usuario, usar datos por defecto
      setData(getDefaultData());
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
          // En caso de error, usar datos por defecto
          setData(getDefaultData());
          setLoading(false);
        });
    }
  };

  return { data, loading, refetch, setData };
};
