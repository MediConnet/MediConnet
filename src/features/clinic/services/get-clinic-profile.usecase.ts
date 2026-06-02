import type { ClinicProfile } from '../types/clinic.entity';
import { getClinicProfileAPI } from '../api/clinic.api';

export const getClinicProfileUseCase = async (): Promise<ClinicProfile> => {
  return await getClinicProfileAPI();
};
