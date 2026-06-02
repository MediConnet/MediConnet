import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../app/store/auth.store';
import type { ClinicInfo, ClinicAssociatedDoctorProfile } from '../types/ClinicAssociatedDoctor.entity';
import { getClinicInfoAPI } from '../api/clinic-associated.api';
import { getClinicAssociatedProfileAPI } from '../api/clinic-associated.api';
import { getDoctorDashboardAPI } from '../../doctor/api/doctors.api';
import { createLogger } from '../../../shared/lib/logger';
import { logApiError } from '../../../shared/lib/api-error';

const clinicAssocLog = createLogger('useClinicAssociatedDoctor');

export const useClinicAssociatedDoctor = ({ fetchProfile = true }: { fetchProfile?: boolean } = {}) => {
  const [isClinicAssociated, setIsClinicAssociated] = useState<boolean>(false);
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null);
  const [profile, setProfile] = useState<ClinicAssociatedDoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const authStore = useAuthStore();
  const { user } = authStore;

  useEffect(() => {
    const checkClinicAssociation = async () => {
      setLoading(true);

      if (user?.tipo !== 'doctor' || (user?.role !== 'provider' && user?.role !== 'profesional')) {
        setIsClinicAssociated(false);
        setClinicInfo(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userId = user?.id;
        if (!userId) {
          throw new Error('User ID no disponible');
        }

        try {
          const dashboardData = await getDoctorDashboardAPI(userId);

          if (dashboardData.clinic !== null && dashboardData.clinic !== undefined) {
            setIsClinicAssociated(true);
            setClinicInfo({
              id: dashboardData.clinic.id,
              name: dashboardData.clinic.name,
              address: dashboardData.clinic.address || '',
              phone: dashboardData.clinic.phone || '',
              whatsapp: dashboardData.clinic.whatsapp || '',
              logoUrl: dashboardData.clinic.logoUrl,
            });

            if (fetchProfile) {
              try {
                const profileData = await getClinicAssociatedProfileAPI();
                setProfile(profileData);
              } catch (profileError: any) {
                clinicAssocLog.warn('Perfil de médico asociado no disponible (no crítico)', profileError);
              }
            }
          } else {
            setIsClinicAssociated(false);
            setClinicInfo(null);
            setProfile(null);
          }
        } catch (dashboardError: any) {
          clinicAssocLog.warn('Dashboard falló; usando clinic-info como respaldo', dashboardError);

          try {
            const clinicData = await getClinicInfoAPI();

            if (clinicData && clinicData.id) {
              setIsClinicAssociated(true);
              setClinicInfo(clinicData);

              if (fetchProfile) {
                try {
                  const profileData = await getClinicAssociatedProfileAPI();
                  setProfile(profileData);
                } catch (profileError) {
                  clinicAssocLog.warn('Perfil de médico asociado no disponible (no crítico)', profileError);
                }
              }
            } else {
              clinicAssocLog.info('Doctor no asociado a clínica (null)');
              setIsClinicAssociated(false);
              setClinicInfo(null);
              setProfile(null);
            }
          } catch (clinicInfoError: any) {
            const statusCode = clinicInfoError?.response?.status || clinicInfoError?.status;
            if (statusCode === 404) {
              clinicAssocLog.info('Doctor no asociado a clínica (404)');
              setIsClinicAssociated(false);
              setClinicInfo(null);
              setProfile(null);
            } else {
              logApiError('useClinicAssociatedDoctor', clinicInfoError);
              setIsClinicAssociated(false);
              setClinicInfo(null);
              setProfile(null);
            }
          }
        }
      } catch (error: any) {
        logApiError('useClinicAssociatedDoctor', error);
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
