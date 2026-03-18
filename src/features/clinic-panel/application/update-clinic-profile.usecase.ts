import type { ClinicProfile } from '../domain/clinic.entity';
import { updateClinicProfileAPI } from '../infrastructure/clinic.api';
import { saveClinicProfileMock } from '../infrastructure/clinic.mock';

export const updateClinicProfileUseCase = async (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
  return await updateClinicProfileAPI(profile);
};
