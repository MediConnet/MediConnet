import type { ClinicProfile } from '../domain/clinic.entity';
import { updateClinicProfileAPI } from '../infrastructure/clinic.api';

export const updateClinicProfileUseCase = async (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
  return await updateClinicProfileAPI(profile);
};
