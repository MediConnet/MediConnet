import type { ClinicProfile } from '../types/clinic.entity';
import { updateClinicProfileAPI } from '../api/clinic.api';

export const updateClinicProfileUseCase = async (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
  return await updateClinicProfileAPI(profile);
};
