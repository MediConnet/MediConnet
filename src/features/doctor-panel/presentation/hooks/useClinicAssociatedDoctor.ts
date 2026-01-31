import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../app/store/auth.store';
import type { ClinicInfo, ClinicAssociatedDoctorProfile } from '../../domain/ClinicAssociatedDoctor.entity';
import { getClinicInfoAPI } from '../../infrastructure/clinic-associated.api';
import { getClinicAssociatedProfileAPI } from '../../infrastructure/clinic-associated.api';
import { getDoctorDashboardAPI } from '../../infrastructure/doctors.api';

/**
 * Hook para detectar si un médico está asociado a una clínica
 * y obtener información relacionada
 * 
 * ⚠️ IMPORTANTE: No usa mocks cuando el backend retorna 404.
 * 404 significa "no asociado", no un error.
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
      
      // Solo verificar si es un médico
      if (user?.tipo !== 'doctor' || (user?.role !== 'provider' && user?.role !== 'profesional')) {
        setIsClinicAssociated(false);
        setClinicInfo(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // ✅ OPCIÓN 1: Verificar desde el dashboard (MÁS CONFIABLE)
        // El dashboard siempre incluye el campo 'clinic' (puede ser null)
        const userId = user?.id;
        if (!userId) {
          throw new Error('User ID no disponible');
        }

        try {
          const dashboardData = await getDoctorDashboardAPI(userId);
          
          // ✅ Verificar si clinic existe y no es null/undefined
          if (dashboardData.clinic !== null && dashboardData.clinic !== undefined) {
            // ✅ Está asociado a una clínica
            setIsClinicAssociated(true);
            setClinicInfo({
              id: dashboardData.clinic.id,
              name: dashboardData.clinic.name,
              address: dashboardData.clinic.address || '',
              phone: dashboardData.clinic.phone || '',
              whatsapp: dashboardData.clinic.whatsapp || '',
              logoUrl: dashboardData.clinic.logoUrl,
            });

            // Intentar obtener perfil del médico asociado (opcional)
            try {
              const profileData = await getClinicAssociatedProfileAPI();
              setProfile(profileData);
            } catch (profileError: any) {
              // Si falla obtener el perfil, no es crítico
              // Solo loguear el error, pero mantener isClinicAssociated = true
              console.warn('No se pudo cargar el perfil del médico asociado:', profileError);
            }
          } else {
            // ✅ NO está asociado - clinic es null o undefined
            setIsClinicAssociated(false);
            setClinicInfo(null);
            setProfile(null);
          }
        } catch (dashboardError: any) {
          // Si falla el dashboard, intentar con clinic-info como respaldo
          console.warn('Error obteniendo dashboard, intentando con clinic-info:', dashboardError);
          
          // ✅ OPCIÓN 2: Verificar desde clinic-info (RESPALDO)
          try {
            const clinicData = await getClinicInfoAPI();
            
            // ⭐ NUEVO: Verificar si clinicData es null (médico no asociado)
            // El backend ahora retorna null en lugar de 404 cuando no está asociado
            if (clinicData && clinicData.id) {
              setIsClinicAssociated(true);
              setClinicInfo(clinicData);
              
              // Intentar obtener perfil
              try {
                const profileData = await getClinicAssociatedProfileAPI();
                setProfile(profileData);
              } catch (profileError) {
                console.warn('No se pudo cargar el perfil del médico asociado:', profileError);
              }
            } else {
              // ⭐ NUEVO: Backend retorna null cuando no está asociado
              console.log('Doctor no está asociado a ninguna clínica (backend retornó null)');
              setIsClinicAssociated(false);
              setClinicInfo(null);
              setProfile(null);
            }
          } catch (clinicInfoError: any) {
            // ⭐ ACTUALIZADO: El backend ahora retorna null en lugar de 404
            // Si hay un error HTTP real, manejarlo
            const statusCode = clinicInfoError?.response?.status || clinicInfoError?.status;
            if (statusCode === 404) {
              console.log('Doctor no está asociado a ninguna clínica (404)');
              setIsClinicAssociated(false);
              setClinicInfo(null);
              setProfile(null);
            } else {
              console.error('Error verificando asociación con clínica:', clinicInfoError);
              setIsClinicAssociated(false);
              setClinicInfo(null);
              setProfile(null);
            }
          }
        }
      } catch (error: any) {
        // ✅ Error general - asumir que NO está asociado
        console.error('Error verificando asociación con clínica:', error);
        setIsClinicAssociated(false);
        setClinicInfo(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkClinicAssociation();
  }, [user]);

  return {
    isClinicAssociated,
    clinicInfo,
    profile,
    loading,
  };
};
