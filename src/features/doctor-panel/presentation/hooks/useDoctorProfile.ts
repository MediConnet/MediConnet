import { useEffect, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { DoctorDashboard } from "../../domain/DoctorDashboard.entity";
import { getDoctorProfileAPI } from "../../infrastructure/doctors.api";

export const useDoctorProfile = () => {
  const [profileData, setProfileData] = useState<DoctorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getDoctorProfileAPI();
      setProfileData(data);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  return { profileData, loading, refetch: fetchProfile };
};