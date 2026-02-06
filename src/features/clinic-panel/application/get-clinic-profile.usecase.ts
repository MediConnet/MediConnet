import type { ClinicProfile } from '../domain/clinic.entity';
import { getClinicProfileAPI } from '../infrastructure/clinic.api';
import { getClinicProfileMock } from '../infrastructure/clinic.mock';

export const getClinicProfileUseCase = async (): Promise<ClinicProfile> => {
  try {
    return await getClinicProfileAPI();
  } catch (error) {
    console.warn('⚠️ Error al obtener perfil del backend, usando mock:', error);
    return await getClinicProfileMock();
  }
};
