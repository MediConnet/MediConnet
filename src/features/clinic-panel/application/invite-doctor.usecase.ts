import type { DoctorInvitation } from '../domain/doctor.entity';
import { inviteDoctorByEmailAPI } from '../infrastructure/clinic-doctors.api';

export const inviteDoctorUseCase = async (
  _clinicId: string,
  email: string
): Promise<DoctorInvitation> => {
  return await inviteDoctorByEmailAPI(email);
};
