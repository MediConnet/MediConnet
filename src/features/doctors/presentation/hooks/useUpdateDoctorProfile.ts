import { useState } from "react";
import { updateDoctorProfileUseCase } from "../../application/update-doctor-profile.usecase";
import type { DoctorDashboard } from "../../domain/DoctorDashboard.entity";
import type { UpdateDoctorProfileParams } from "../../infrastructure/doctors.api";

export const useUpdateDoctorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    userId: string,
    params: UpdateDoctorProfileParams
  ): Promise<DoctorDashboard | null> => {
    setLoading(true);
    setError(null);

    try {
      const updatedDashboard = await updateDoctorProfileUseCase(userId, params);
      setLoading(false);
      return updatedDashboard;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el perfil");
      setLoading(false);
      return null;
    }
  };

  return { updateProfile, loading, error };
};

