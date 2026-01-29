import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../app/store/auth.store';
import type { ClinicInfo, ClinicAssociatedDoctorProfile } from '../../domain/ClinicAssociatedDoctor.entity';
import { getClinicInfoAPI } from '../../infrastructure/clinic-associated.api';
import { getClinicAssociatedProfileAPI } from '../../infrastructure/clinic-associated.api';
import { getClinicInfoMock } from '../../infrastructure/clinic-associated.mock';
import { getClinicAssociatedProfileMock } from '../../infrastructure/clinic-associated.mock';

/**
 * Hook para detectar si un médico está asociado a una clínica
 * y obtener información relacionada
 */
export const useClinicAssociatedDoctor = () => {
  const [isClinicAssociated, setIsClinicAssociated] = useState<boolean>(false);
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null);
  const [profile, setProfile] = useState<ClinicAssociatedDoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const authStore = useAuthStore();
  const { user } = authStore;

  useEffect(() => {
    const checkClinicAssociation = async () => {
      setLoading(true);
      try {
        // Primero verificar si el dashboard tiene información de clínica
        // Esto se hace desde DoctorDashboardPage, pero aquí también podemos verificar
        // Intentar obtener información de clínica desde el backend
        try {
          const clinicData = await getClinicInfoAPI();
          setClinicInfo(clinicData);
          setIsClinicAssociated(true);
          
          // Obtener perfil del médico asociado
          try {
            const profileData = await getClinicAssociatedProfileAPI();
            setProfile(profileData);
          } catch (error) {
            console.warn('No se pudo cargar el perfil del médico asociado:', error);
          }
        } catch (error) {
          // Si falla, intentar con mocks (solo para desarrollo)
          console.warn('No se pudo obtener información de clínica desde backend, usando mocks');
          try {
            const clinicData = await getClinicInfoMock();
            setClinicInfo(clinicData);
            setIsClinicAssociated(true);
            
            const profileData = await getClinicAssociatedProfileMock();
            setProfile(profileData);
          } catch (mockError) {
            // Si también fallan los mocks, no está asociado
            setIsClinicAssociated(false);
            setClinicInfo(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Error verificando asociación con clínica:', error);
        setIsClinicAssociated(false);
      } finally {
        setLoading(false);
      }
    };

    // Solo verificar si es un médico
    if (user?.tipo === 'doctor' && (user?.role === 'provider' || user?.role === 'profesional')) {
      checkClinicAssociation();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    isClinicAssociated,
    clinicInfo,
    profile,
    loading,
  };
};
