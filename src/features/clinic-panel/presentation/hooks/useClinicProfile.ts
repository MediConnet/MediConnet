import { useState, useEffect } from 'react';
import { getClinicProfileUseCase } from '../../application/get-clinic-profile.usecase';
import { updateClinicProfileUseCase } from '../../application/update-clinic-profile.usecase';
import type { ClinicProfile } from '../../domain/clinic.entity';

export const useClinicProfile = () => {
  const [profile, setProfile] = useState<ClinicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClinicProfileUseCase();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar perfil'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: ClinicProfile) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Actualizando perfil...', updatedProfile);
      const data = await updateClinicProfileUseCase(updatedProfile);
      console.log('✅ Perfil actualizado:', data);
      setProfile(data);
      return data;
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      setError(err instanceof Error ? err : new Error('Error al actualizar perfil'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { profile, loading, error, updateProfile, refetch: loadProfile };
};
