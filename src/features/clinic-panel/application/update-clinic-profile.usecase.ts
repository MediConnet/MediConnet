import type { ClinicProfile } from '../domain/clinic.entity';
import { updateClinicProfileAPI } from '../infrastructure/clinic.api';
import { saveClinicProfileMock } from '../infrastructure/clinic.mock';

export const updateClinicProfileUseCase = async (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
  try {
    return await updateClinicProfileAPI(profile);
  } catch (error) {
    console.warn('⚠️ Error al actualizar perfil en backend, usando mock:', error);
    // Para el mock, necesitamos el perfil completo
    const fullProfile = profile as ClinicProfile;
    await saveClinicProfileMock(fullProfile);
    return fullProfile;
  }
};
