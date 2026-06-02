import type { DoctorInvitation } from '../types/doctor.entity';
import { inviteDoctorByEmailAPI } from '../api/clinic-doctors.api';

export const inviteDoctorUseCase = async (
  _clinicId: string,
  email: string
): Promise<DoctorInvitation> => {
  return await inviteDoctorByEmailAPI(email);
};
