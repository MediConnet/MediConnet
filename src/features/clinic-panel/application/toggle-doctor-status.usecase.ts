import { toggleDoctorStatusAPI } from '../infrastructure/clinic-doctors.api';

export const toggleDoctorStatusUseCase = async (
  _clinicId: string,
  doctorId: string,
  isActive: boolean
): Promise<void> => {
  await toggleDoctorStatusAPI(doctorId, isActive);
};
